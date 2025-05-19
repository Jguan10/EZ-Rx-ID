import requests

image_path = "D:/rximage/image/images/split_padded_rotated/00002-3270-30_RXNAVIMAGE10_A91354EA_bottom_8.jpg"
url = "http://127.0.0.1:5000/predict"

with open(image_path, "rb") as f:
    files = {'image': f}
    response = requests.post(url, files=files)

print("Status code:", response.status_code)
print("Response JSON:", response.json())