import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import pandas as pd
import xgboost as xgb
import joblib
import numpy as np
# ---------- Constants ----------
COLOR_COLUMNS = [
    'is_red', 'is_blue', 'is_black', 'is_gray', 'is_orange', 'is_yellow',
    'is_turquoise', 'is_green', 'is_white', 'is_pink', 'is_brown', 'is_purple'
]

PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------- Model Builders ----------
def build_binary_model():
    model = models.resnet18(pretrained=False)
    model.fc = nn.Sequential(nn.Linear(model.fc.in_features, 1), nn.Sigmoid())
    return model

def build_shape_model(num_classes):
    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model

def build_color_model(num_classes):
    model = models.resnet18(pretrained=False)
    model.fc = nn.Sequential(
        nn.Linear(model.fc.in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, num_classes),
        nn.Sigmoid()
    )
    return model

# ---------- Loaders ----------
def load_label_map(path):
    with open(path, "r") as f:
        return json.load(f)

def load_image(image_path):
    img = Image.open(image_path).convert("RGB")
    return PREPROCESS(img).unsqueeze(0).to(DEVICE)

def get_filename(image_path):
    return os.path.splitext(os.path.basename(image_path))[0]

# ---------- Prediction Wrappers ----------
def predict_is_printed(model, image_path):
    input_tensor = load_image(image_path)
    with torch.no_grad():
        prob = model(input_tensor).item()
    return pd.DataFrame([{
        "filename": get_filename(image_path),
        "is_printed_pred": int(prob >= 0.5),
        "is_printed_pred_probability": prob
    }])

def predict_is_scored(model, image_path):
    input_tensor = load_image(image_path)
    with torch.no_grad():
        prob = model(input_tensor).item()
    return pd.DataFrame([{
        "filename": get_filename(image_path),
        "is_scored_pred": int(prob >= 0.5),
        "is_scored_probability": prob
    }])

def predict_shape(model, label_map, image_path):
    input_tensor = load_image(image_path)
    with torch.no_grad():
        output = model(input_tensor)
        pred_idx = torch.argmax(output, dim=1).item()
    return pd.DataFrame([{
        "filename": get_filename(image_path),
        "shape_pred": label_map[str(pred_idx)]
    }])

def predict_color(model, image_path):
    input_tensor = load_image(image_path)
    with torch.no_grad():
        output = model(input_tensor).cpu().numpy().flatten()
    return pd.DataFrame([output], columns=COLOR_COLUMNS).assign(filename=get_filename(image_path))



def predict_single_row(input_row: dict, model, le_base, le_shape) -> dict:
    input_row = input_row.copy()

    # Remove unused fields
    input_row.pop("filename", None)

    # Encode shape_pred string to int label BEFORE DataFrame creation
    if "shape_pred" in input_row:
        input_row["shape_pred_encoded"] = le_shape.transform([input_row["shape_pred"]])[0]
        input_row.pop("shape_pred")

    # Load feature columns (list of strings)
    feature_columns = joblib.load("xgb_feature_columns.pkl")

    # Build DataFrame with input row
    df_input = pd.DataFrame([input_row])

    # Ensure all expected columns are present, add missing with default 0
    for col in feature_columns:
        if col not in df_input.columns:
            df_input[col] = 0

    # Select and reorder columns for the model input
    df_input = df_input[feature_columns].astype("float32")

    # Predict probabilities for all classes
    proba = model.predict_proba(df_input)[0]  # shape: (n_classes,)

    # Get top-3 class indices
    top3_indices = np.argsort(proba)[::-1][:3]

    # Map indices to class labels and probabilities
    top3_predictions = [
        {
            "label": le_base.inverse_transform([idx])[0],
            "probability": float(proba[idx])
        }
        for idx in top3_indices
    ]

    return {
        "predictions": top3_predictions
    }