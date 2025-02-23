from datetime import time
import eventlet

eventlet.monkey_patch()

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))

from model.api.images import train, predict, model_predict
from time import sleep
from flask import Flask
from flask import request, jsonify
from flask_socketio import SocketIO, emit
import base64
from flask_cors import CORS
from io import BytesIO
from PIL import Image
import threading

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(
    app, cors_allowed_origins="*", max_http_buffer_size=100 * 1024 * 1024
)#100 MB  

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dataset')

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


def convert_image_to_PIL(image_data):
    """Converts Base64 image data to a PIL Image object."""
    try:
        if isinstance(image_data, str):
            header, encoded = image_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
        elif isinstance(image_data, (bytes, bytearray)):
            image_bytes = image_data
        else:
            print(f"Unsupported image data type found")
            return None

        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        return image
    except Exception as e: 
        print(f"Error while converting Image: {e}")
def save_image(image_data, class_name, idx):
    """Handles saving an image with a unique filename into a class-specific folder."""
    try:
        class_folder = os.path.join(UPLOAD_DIR, "class-" + class_name.replace(" ", "_"))
        if not os.path.exists(class_folder):
            os.makedirs(class_folder)
        image = convert_image_to_PIL(image_data)
        filename = f"{idx}.png"
        if(image):
            filepath = os.path.join(class_folder, filename)
            image.save(filepath)
        return filename
    except Exception as e:
        print(f"Error saving image {idx}: {e}")
        return f"Error {idx} : {e}"


@socketio.on("upload_images")
def handle_upload_images(data):
    """
    Expected data format:
    {
        "images": [list of Base64 data URLs or binary blobs],
        "class": "class label"
    }
    """
    print("Socket received data")
    images = data.get("images", [])
    class_name = data.get("class", "unknown")
    # isUpdated = data.get("update",False)
    # updatedIndex = data.get("updated_index",0)

    num_images = len(images)
    print(f"Received {num_images} images for class '{class_name}'")

    if num_images == 0:
        print(data.get("images", []))
        emit("response", {"message": "No images received."})
        return

    saved_files = []

    threads = []
    results = [None] * num_images  

    def process_image(index :int, img_data :str):
        results[index] = save_image(img_data, class_name, index)

    for idx, image_data in enumerate(images):
        thread = threading.Thread(target=process_image, args=(idx, image_data))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    saved_files = [filename for filename in results if filename]

    response_message = f"Saved {len(saved_files)} images out of {num_images}."
    print(response_message)
    emit("response", {"message": response_message, "files": saved_files})

@socketio.on("predict")
def imagePredict(data):
    """
    Used to predict stream of data
    Expected data format:
    {
        "image": [list of Base64 data URLs or binary blobs],
    }
    returns
    {
        "class": predicted class,
    }
    """

    image = data.get("image",None)
    breakLoop = data.get("break",False)
    image = convert_image_to_PIL(image)
    while True:
        if breakLoop or image is None:
            break
        result = model_predict(image)
        if result[0]:
            emit("predict_response",result)
        else:
            print("Internal Server Error")
            break
        sleep(0.1)
        



@app.route("/")
def index():
    return "Flask SocketIO Server is running."


@app.route("/train", methods=["POST"])
def train_route():
    data = request.get_json()

    num_epochs = data.get('num_epochs', 5)
    batch_size = data.get('batch_size', 32)
    learning_rate = data.get('learning_rate', 0.001)

    result = train(num_epochs=num_epochs, batch_size=batch_size, learning_rate=learning_rate)

    return jsonify({"message": "Training started", "result": result})

if __name__ == "__main__":
    socketio.run(app, debug=True)
