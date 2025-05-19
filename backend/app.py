from flask import Flask, request, jsonify
import os
import uuid
import shutil

from pipeline import (
    build_binary_model, build_shape_model, build_color_model,
    load_label_map, predict_is_printed, predict_is_scored,
    predict_shape, predict_color, DEVICE
)
import torch
import xgboost as xgb
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <-- Add this line

# --- Load models and encoders once at startup ---
printed_model = build_binary_model()
printed_model.load_state_dict(torch.load("D:/capstone/EZ-Rx-ID/models/printed_model.pth", map_location=DEVICE))
printed_model.to(DEVICE).eval()

scored_model = build_binary_model()
scored_model.load_state_dict(torch.load("D:/capstone/EZ-Rx-ID/models/scored_model.pth", map_location=DEVICE))
scored_model.to(DEVICE).eval()

shape_labels = load_label_map("D:/capstone/EZ-Rx-ID/backend/shape_model/shape_label_map.json")
shape_model = build_shape_model(len(shape_labels))
shape_model.load_state_dict(torch.load("D:/capstone/EZ-Rx-ID/models/shape_model.pth", map_location=DEVICE))
shape_model.to(DEVICE).eval()

color_model = build_color_model(num_classes=12)
color_model.load_state_dict(torch.load("D:/capstone/EZ-Rx-ID/models/color_model.pth", map_location=DEVICE))
color_model.to(DEVICE).eval()

booster_model = xgb.Booster()
booster_model.load_model("xgb_model.json")

le_base = joblib.load("label_encoder_base_filename.pkl")
le_shape = joblib.load("label_encoder_shape_pred.pkl")
feature_columns = joblib.load("xgb_feature_columns.pkl")

# --- API route ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    image = request.files['image']
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    filename = f"temp_{uuid.uuid4().hex}.jpg"
    temp_path = os.path.join(temp_dir, filename)
    image.save(temp_path)

    try:
        # Run prediction pipeline
        df_printed = predict_is_printed(printed_model, temp_path)
        df_scored = predict_is_scored(scored_model, temp_path)
        df_shape = predict_shape(shape_model, shape_labels, temp_path)
        df_color = predict_color(color_model, temp_path)

        input_row = df_scored.merge(df_color, on="filename").merge(df_shape, on="filename").merge(df_printed, on="filename")
        input_row = input_row.iloc[0].to_dict()

        if "shape_pred" in input_row:
            input_row["shape_pred_encoded"] = le_shape.transform([input_row["shape_pred"]])[0]
            input_row.pop("shape_pred")

        df_input = pd.DataFrame([input_row])

        if "shape_pred" in feature_columns and "shape_pred_encoded" in df_input.columns:
            df_input["shape_pred"] = df_input["shape_pred_encoded"]
            df_input.drop(columns=["shape_pred_encoded"], inplace=True)

        # Existing logic
        df_input = df_input[feature_columns].astype("float32")
        dinput = xgb.DMatrix(df_input)
        preds = booster_model.predict(dinput)  # shape: (1, num_classes)

        # Extract top-3 class indices
        top3_indices = np.argsort(preds[0])[::-1][:3]  # sort descending, take top 3

        # Build predictions with label and probability
        top3_predictions = [
            {
                "label": le_base.inverse_transform([i])[0],
                "probability": float(preds[0][i])
            }
            for i in top3_indices
        ]

        # Return top-3 predictions as JSON
        return jsonify({
            "predictions": top3_predictions
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- Run the app ---
if __name__ == '__main__':
    app.run(debug=True)