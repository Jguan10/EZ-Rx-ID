# EZ-Rx-ID Backend

This is the Flask-based backend for EZ-Rx-ID, a pill identification system that uses multiple computer vision models and an XGBoost classifier to identify pills based on an input image.

---

## Requirements

- **Python 3.12 is required**  
  Download Python 3.12 here: https://www.python.org/downloads/release/python-3120/

To check your Python version, run:

python --version
If needed, run commands explicitly with Python 3.12:

C:\Python312\python.exe app.py

Setup Instructions
1. Clone the repository

git clone https://github.com/Jguan10/EZ-Rx-ID.git
cd EZ-Rx-ID/backend
2. Install dependencies
Using Python 3.12:

C:\Python312\python.exe -m pip install -r requirements.txt
3. Download xgb_model.json
Due to GitHub’s 100MB file size limit, the XGBoost model file must be downloaded manually.

Download it from Google Drive:
https://drive.google.com/file/d/1C6SaAXGr3oq5lr4DgmosQfwSarQ1j-Qm/view?usp=sharing

Place it in the backend/ folder so that app.py can access it.

Running the Backend
From the backend/ folder, run:

C:\Python312\python.exe app.py
This starts the Flask server at:

http://127.0.0.1:5000
API Endpoint
POST /predict
Send a pill image to receive a predicted label.

Method: POST

Content-Type: multipart/form-data

Field name: file

curl -X POST http://127.0.0.1:5000/predict -F "file=@example_pill.jpg"
Example response:

{
  "prediction": "Ibuprofen 200mg",
  "confidence": 0.92
}

##How It Works
The image is saved temporarily.

Four PyTorch models predict pill properties: shape, color, printed (yes/no), scored (yes/no).

These outputs are combined and passed to an XGBoost classifier.

The backend returns the final pill name prediction and confidence.

