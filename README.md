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
- 🧫 Gemini judge model, evaluating generated responses for a recursive process
- 💉 AI tool calling agent, gathering context from trusted sources if response is not valid

## How to Run 🚀
### 1. Setup
- Clone the repo
```git clone https://github.com/Jguan10/EZ-Rx-ID.git```
- Then navigate to the folder
```cd EZ-Rx-ID```

### 2. Start RAG Flask API
- Navigate to the Flask RAG folder
```cd rag_model```
- Install requirements
```pip install -r requirements.txt```
- Download and unzip my_vector_store.zip, its on [Google Drive](https://drive.google.com/file/d/1ntzECW0b9HCMMLO6uH7BohMt7ziI8qy3/view?usp=sharing) due to github file constraints
- Run flask app
```python flask_rag.py```
- Note that the RAG model requires 15 GB of VRAM
- You'll need to contact jiaxiong.guan65@myhunter.cuny.edu for API keys 

### 3. Start Backend API
- Navigate to the Backend folder
```cd backend```
- Install requirements
```pip install -r requirements.txt```
- Download the xgb_model.json, its hosted on [Google Drive](https://drive.google.com/file/d/1C6SaAXGr3oq5lr4DgmosQfwSarQ1j-Qm/view?usp=sharing) due to github file constraints
- Place xgb_model.json in backend folder
- Run flask app
```python app.py```

### 4. Start Frontend
- Navigate to the Frontend folder
```cd frontend```
- Install packages
```npm install```
- Start the app
```npm start```



