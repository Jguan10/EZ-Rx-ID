# EZ-Rx-ID 💊
## Gitbook📖
### Click [Here](https://jasons-organization-58.gitbook.io/rx_id)
Gitbook contains more in-depth view of the project and more detailed explanations

## Design Overview 💻
![project_design](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/Overall_architecture.PNG)
![rag_arch](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/RAG_architecture.PNG)
![CV_arch](https://github.com/Jguan10/EZ-Rx-ID/blob/main/images/CV_architecture.PNG)

## Features ✨
- 🥼 RAG model summarizing FDA medical data, including medicine usage, side effects, and clinical trials
- 🤖 Computer Vision model identifying pills, trained on NIH image dataset
- 🩺 Data pipeline built with LangChain, FAISS, and FlagEmbeddings for efficient retrieval and augmentation
- 🧬 Supabase holding pill images for model training, along with metadata and indexes
- 🧫 BioGPT as an LLM agent, called on when context is insufficient (WIP)
- 🔬 XGBoost classification model boasting 92% precision and 88% accuracy

## How to Run 🚀
### How to Run XGBoost
- Use df_rximages_final and xgboost.ipynb
- Install xgboost and scikitlearn

### How to Run Backend
- Install packages in requirements.txt
- Run app.py
- Contact doug for database keys

### How to Run Frontend
- Clone doug's repository found [here](https://github.com/DouglasRollman/frontend)
- Install dependencies with npm install
- Run with npm start
- Contact doug for database keys

### How to Run RAG
- Get FAISS index (linked in gitbook)
- Install required packages
- Run code and function

## Future Steps 🔧
### Rag Development
- Adding other tools like BioGPT, an LLM to evaluate responses
- Restructuring vectorDB
- Further transforming of Data

### Computer Vision Development
- Ensemble strategy
- Model fine tuning
- Evaluate model performance

### Frontend Development
- Improved design (UI/UX)
- Explore more cloud options
- Connecting backend to frontend

