import json
from flask import Flask, request, jsonify
from flask_cors import CORS   # type: ignore
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  

# Load class mapping
with open("class_mapping.json", "r") as f:
    class_mapping = json.load(f)

# Define the model
num_classes = 500  
model = models.resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)

# Load trained model weights
model.load_state_dict(torch.load("7th_epoch_500p.pth", map_location=torch.device("cpu")))
model.eval()

# Define image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image = transform(image).unsqueeze(0)  

    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)  # Convert logits to probabilities

        # Log the raw probabilities to ensure they're valid
        print("Raw Probabilities: ", probabilities)

        top3_probs, top3_indices = torch.topk(probabilities, 3)

    predictions = []
    for i in range(3):
        predicted_class = int(top3_indices[0][i].item())
        probability = float(top3_probs[0][i].item())
        
        # Ensure the probability is not NaN
        if probability != probability:  # NaN check
            probability = 0.0

        pill_name = class_mapping.get(str(predicted_class), "Unknown Pill")
        
        # Append prediction with formatted confidence as percentage
        predictions.append({
            "pill_name": pill_name,
            "probability": f"{(probability * 100):.2f}%"  # Format as percentage with 2 decimals
        })

    return jsonify({"predictions": predictions})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)