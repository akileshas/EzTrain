import os
import sys
import base64
import threading
import asyncio
from io import BytesIO
from PIL import Image

import torch
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketDisconnect
from pydantic import BaseModel

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))

from model.api.images import train, model_predict
from model.mobilenet.constants import ROOT_DATA_DIR, TRANSFORM
from model.mobilenet.dataset import get_classes
from model.mobilenet.preprocess import get_transform
from model.mobilenet.model import get_model

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Configuration
transform = TRANSFORM
transform_augmented = get_transform(augment=True)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
weight_path = os.path.join(
    os.path.dirname(__file__),
    "../model/weights/mobilenet_v1.pth",
)

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dataset"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Global model variables; initially loaded from disk
classes_idx = get_classes(dataset_path=ROOT_DATA_DIR)
classes = [cls.split("-")[-1] for cls in list(classes_idx.keys())]
num_classes = len(classes)
classifier_model = get_model(num_classes=num_classes)
classifier_model.load_state_dict(torch.load(weight_path, map_location=device))
classifier_model.eval()


class TrainRequest(BaseModel):
    num_epochs: int = 5
    batch_size: int = 32
    learning_rate: float = 0.001


def convert_image_to_PIL(image_data: str):
    try:
        header, encoded = image_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        return image
    except Exception as e:
        print(f"Error while converting Image: {e}")
        return None


def save_image(image_data: str, class_name: str, idx: int):
    try:
        class_folder = os.path.join(UPLOAD_DIR, f"class-{class_name.replace(' ', '_')}")
        os.makedirs(class_folder, exist_ok=True)
        image = convert_image_to_PIL(image_data)
        if image:
            filename = f"{idx}.png"
            filepath = os.path.join(class_folder, filename)
            image.save(filepath)
            return filename
        else:
            raise ValueError("Invalid image data")
    except Exception as e:
        print(f"Error saving image {idx}: {e}")
        return None


@app.post("/train")
async def train_route(request: TrainRequest):
    result = train(
        num_epochs=request.num_epochs,
        batch_size=request.batch_size,
        learning_rate=request.learning_rate,
    )
    global classifier_model, classes, num_classes

    classes_idx = get_classes(dataset_path=ROOT_DATA_DIR)
    classes = [cls.split("-")[-1] for cls in list(classes_idx.keys())]
    num_classes = len(classes)
    classifier_model = get_model(num_classes=num_classes)
    classifier_model.load_state_dict(torch.load(weight_path, map_location=device))
    classifier_model.eval()

    return JSONResponse(content={"message": "Training completed", "result": result})


@app.get("/get_weights")
async def get_weights():
    if os.path.exists(weight_path):
        return FileResponse(weight_path, filename="mobilenet_v1.pth", media_type="application/octet-stream")
    else:
        raise HTTPException(status_code=404, detail="Weights file not found")


@app.websocket("/ws/upload_images")
async def websocket_upload_images(websocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            images = data.get("images", [])
            class_name = data.get("class", "unknown")
            num_images = len(images)
            print(f"Received {num_images} images for class '{class_name}'")

            if num_images == 0:
                await websocket.send_json({"message": "No images received."})
                continue

            results = [None] * num_images

            def process_image(index, img_data):
                results[index] = save_image(img_data, class_name, index)

            threads = []
            for idx, image_data in enumerate(images):
                thread = threading.Thread(target=process_image, args=(idx, image_data))
                threads.append(thread)
                thread.start()

            for thread in threads:
                thread.join()

            saved_files = [filename for filename in results if filename]
            response_message = f"Saved {len(saved_files)} images out of {num_images}."
            print(response_message)
            await websocket.send_json({"message": response_message, "files": saved_files})
    except WebSocketDisconnect:
        print("Client disconnected")


@app.websocket("/ws/predict")
async def websocket_predict(websocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            image_data = data.get("image", None)
            break_loop = data.get("break", False)

            if break_loop or image_data is None:
                break

            image = convert_image_to_PIL(image_data)
            if image:
                result = model_predict(
                    classifier_model=classifier_model,
                    transform_augmented=transform_augmented,
                    device=device,
                    classes=classes,
                    image=image,
                )
                if result[0]:
                    await websocket.send_json({"class": result[1]})
                else:
                    print("Internal Server Error")
                    await websocket.send_json({"message": "Internal Server Error"})
                    break
            else:
                await websocket.send_json({"message": "Invalid image data"})
                break
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print("Client disconnected")
