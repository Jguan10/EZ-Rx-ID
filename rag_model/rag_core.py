## Load libraries
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, GenerationConfig, pipeline
from langchain.agents import AgentExecutor, create_tool_calling_agent, Tool
from langchain.utilities import SerpAPIWrapper
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import re
import os
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFacePipeline
from FlagEmbedding import FlagAutoModel

## Load deepseek
model_name = "deepseek-ai/deepseek-llm-7b-chat"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.bfloat16, device_map="cuda")
model.generation_config = GenerationConfig.from_pretrained(model_name)
model.generation_config.pad_token_id = model.generation_config.eos_token_id

## Load embedding model
embed_model = FlagAutoModel.from_finetuned('BAAI/bge-base-en-v1.5',
                                      query_instruction_for_retrieval="Represent this sentence for searching relevant passages:",
                                      use_fp16=True)

## Load gemini for agent
my_key = os.getenv("GEMINI_KEY")
os.environ["GOOGLE_API_KEY"] = my_key
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

## Load vector database
vector_store = FAISS.load_local("my_vector_store", embeddings=embed_model, allow_dangerous_deserialization=True)

## Load and create agent
TRUSTED_SITES = [
    "cdc.gov", 
    "nih.gov",
    "drugs.com",
    "medlineplus.gov",
    "hopkinsmedicine.org",
    "who.int",
    "fda.gov",
    "health.harvard.edu"
]
def medical_search(query: str, max_results: int = 5) -> str:
        filter_domains = " OR ".join([f"site:{domain}" for domain in TRUSTED_SITES])
        full_query = f"{query} {filter_domains}"
    
        search = SerpAPIWrapper()
    
        try:
            raw_results = search.results(full_query)
    
            results_text = []
            count = 0
    
            for result in raw_results.get("organic_results", []):
                url = result.get("link", "")
                if any(domain in url for domain in TRUSTED_SITES):
                    title = result.get("title", "")
                    snippet = result.get("snippet", "")
                    results_text.append(f"Title: {title}\nSnippet: {snippet}\nSource: {url}")
                    count += 1
                if count >= max_results:
                    break
    
            return "\n\n".join(results_text) if results_text else "No trusted medical sources found."
    
        except Exception as e:
            return f"Search failed: {str(e)}"
    
tools = [
    Tool(
        name="TrustedMedicalSearch",
        func=medical_search,
        description="Searches medical information from trusted sources like CDC, NIH, Mayo Clinic, and more."
    )]

prompt = ChatPromptTemplate.from_messages(
    [("system", (
        "You are a medical assistant. You have access to a specialized web search tool "
        "that ONLY returns information from a predefined list of trustworthy sources, "
        "including reputable general, academic, and medical websites. "
        "Use this tool when you need to find current or specific information. "
        "When you provide an answer based on information from the search tool, "
        "If the tool returns 'No information found from trusted sources', state that clearly and do not invent information."
        "If the prompt is asking for medical recommendations or advice, redirect them to a healthcare provider"
        "Examples of prompts that you can answer are prompts asking about side effects, clinical trials, general information, and interactions"
        "Examples of prompts that you cannot answer are prompts asking if someone should take a drug"
        "Prompts requesting for information like can children take a medication should be responded to specifically with preexisting data and explicitly state that a medical professional should be consulted"
        )),
        ("user", "{input}"),
        AIMessage(content="Okay, I will use the trusted search tool if necessary to find the answer from reliable sources."),
        ("placeholder", "{agent_scratchpad}"),
    ]
)
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True, return_intermediate_steps=True)

## Vector search function
def search_vectordb(user_query):
    torch.cuda.empty_cache()
    query = user_query
    embed_query = embed_model.encode([query])
    if "pregnant" in query.lower():
        category = 'specific population usage'
    elif "uses" in query.lower():
        category = 'general'
    elif "clinical" in query.lower():
        category = 'clinical data'
    elif "dose" in query.lower():
        category = 'dosage and administration'
    elif "ingredient" in query.lower():
        return query, "";
    else:
        category = 'general'
    results = vector_store.similarity_search_by_vector(
        embed_query[0], k=1, filter={"category": category})
    cleaned_context = [doc.page_content for doc in results]
    return query, cleaned_context

## RAG generation function
def generate_deep_seek(query, cleaned_context):
  torch.cuda.empty_cache()
  prompt_template = """
  You are an expert medical assistant explaining medicine to someone without any prior knowledge.

  Use ***ONLY*** the provided context to answer the user's question. Respond only with exact information found in the provided text.
  If the context does not contain the answer, say "The context does not provide enough information."
  DO NOT answer questions about mental health and therapy.

  # Context: {context}

  # Question: {question}

  Answer:
  """
  prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
  llm = HuggingFacePipeline(
      pipeline=pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=300)
  )
  qa_chain = prompt | llm
  response = qa_chain.invoke({'context' : cleaned_context, 'question' : query})

  def extract_answer(text):
      # Ensure "Answer: " exists in the string
      if "Answer:" in text:
          return text.split("Answer:", 1)[1]

  result = extract_answer(response)
  return result, cleaned_context

## RAG model evalution function
def self_eval(query, response):
    torch.cuda.empty_cache()
    gem_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
    prompt = PromptTemplate.from_template("""
    Given the following question and answer, determine if the answer is sufficient. An answer is sufficient if it provides ample information related to the question.
    
    An answer is insufficient if it doesn't contain relevant information. Additionally, phrases like "the provided context does not contain" or "the context does not provide" are common     for insufficient answers
    
    Question: {question}
    Answer: {answer}
    
    Respond only with "Sufficient" or "Insufficient".
    """)
    
    question = query
    answer = response
    
    sufficiency_chain = prompt | gem_llm
    
    sufficiency_result = sufficiency_chain.invoke({
        "question": question,
        "answer": answer
    })
    return sufficiency_result.content

## Full generation function
## Calls on vector search, deepseek model generation
## Then evaluates the answer and calls on agent if required
def generate_with_agent(user_query):
    torch.cuda.empty_cache()
    query, cleaned_context = search_vectordb(user_query)
    response, context = generate_deep_seek(query, cleaned_context)
    sufficiency = self_eval(query, response)
    if 'Insufficient' in sufficiency:
        agent_response = agent_executor.invoke({"input": user_query})
        summary = agent_response['output']
        scraped_data = agent_response['intermediate_steps']
        return summary, scraped_data
    else:
        return response, context

