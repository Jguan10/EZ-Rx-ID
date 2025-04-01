import json
from flask import Flask, request, jsonify
from flask_cors import CORS  
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
model.load_state_dict(torch.load("model_epoch_7.pth", map_location=torch.device("cpu")))
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
        _, predicted = torch.max(outputs, 1)
        predicted_class = int(predicted.item())

    # Convert class index to pill name
    pill_name = class_mapping.get(str(predicted_class), "Unknown Pill")

    return jsonify({"prediction": pill_name})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)