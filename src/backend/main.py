import eventlet

eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO, emit
import base64
from flask_cors import CORS
from io import BytesIO
from PIL import Image
import os
import threading

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(
    app, cors_allowed_origins="*", max_http_buffer_size=100 * 1024 * 1024
)  

# Directory where images will be saved
UPLOAD_DIR = "dataset"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)



def convert_image_to_PIL(image_data):
    try:
        if isinstance(image_data, str):
            header, encoded = image_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
        elif isinstance(image_data, (bytes, bytearray)):
            image_bytes = image_data
        else:
            print(f"Unsupported image data type found")
            return None

        # Open the image and convert to RGB
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
        print(type(image))
        if(image):
            filename = f"{idx}.png"
            filepath = os.path.join(class_folder, filename)
            image.save(filepath)
            return filename

    except Exception as e:
        print(f"Error saving image {idx}: {e}")
        return None


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

    # Use threading for parallel processing
    threads = []
    results = [None] * num_images  # Store filenames in order

    def process_image(index, img_data):
        results[index] = save_image(img_data, class_name, index)

    for idx, image_data in enumerate(images):
        thread = threading.Thread(target=process_image, args=(idx, image_data))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    # Collect non-null filenames
    saved_files = [filename for filename in results if filename]

    response_message = f"Saved {len(saved_files)} images out of {num_images}."
    print(response_message)
    emit("response", {"message": response_message, "files": saved_files})


@app.route("predict"):


@app.route("/")
def index():
    return "Flask SocketIO Server is running."


if __name__ == "__main__":
    socketio.run(app, debug=True)
