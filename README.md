# EZ-Rx-ID 💊


## Gitbook📖
### Click [Here](https://jasons-organization-58.gitbook.io/rx_id)
Gitbook contains more in-depth view of the project and more detailed explanations

## Design Overview 💻
![project_design](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/Overall_architecture.PNG)
![rag_arch](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/RAG_architecture.PNG)
![CV_arch](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/CV_architecture.PNG)

## Features ✨
- 🥼 Agentic RAG model summarizing FDA medical data, including medicine usage, side effects, and clinical trials
- 🤖 Computer Vision model identifying pills, trained on NIH image dataset
- 🩺 Data pipeline built with LangChain, FAISS, and FlagEmbeddings for efficient retrieval and augmentation
- 🧬 Supabase holding pill images for model training, along with metadata and indexes
- 🧫 BioGPT as an LLM agent, called on when context is insufficient (WIP)
- 🔬 XGBoost classification model boasting 92% precision and 88% accuracy

## How to Run 🚀
### 1. Setup
- Clone the repo
```git clone https://github.com/Jguan10/EZ-Rx-ID.git```
- Then navigate to the folder
```cd EZ-Rx-ID```

### 2. Start RAG Flask API
- Navigate to the Flask API folder
```cd rag_model```
- Install requirements
```pip install -r requirements.txt```
- Run flask app
```python flask_rag.py```



