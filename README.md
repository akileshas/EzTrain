# EzTrain

Welcome to the EzTrain Platform! This repository offers a comprehensive solution for training, deploying, and interacting with machine learning models seamlessly. With a user-friendly interface and robust backend, you can upload datasets, train models, and make real-time predictions effortlessly.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Upload Images](#1-upload-images)
  - [Train Model](#2-train-model)
  - [Download Model Weights](#3-download-model-weights)
- [WebSocket Events](#websocket-events)
  - [Upload Images](#1-upload-images-1)
  - [Predict](#2-predict)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Image Upload and Classification**: Upload images through a web interface and classify them into predefined categories.
- **Real-time Predictions**: Utilize WebSocket connections for instantaneous model predictions on streamed data.
- **Model Training**: Initiate model training sessions directly from the frontend with customizable parameters.
- **Downloadable Model Weights**: Easily download trained model weights for external use or backup.

## Image Classification Architecture
- **Model**: mobilenet_v2
- **Optimizer**: Adam
- **Loss Function**: Sparse Categorical Crossentropy
- **Metrics**: Accuracy
- **Training Parameters**: Number of epochs, batch size, learning rate
- **Training Technique**: Transfer Learning

## Packages Used
- **FastAPI**: Web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **Torch**: Open-source machine learning library for Python, used for training and deploying models.
- **TorchVision**: Library of vision-specific datasets, models, and transforms for PyTorch.
- **TorchAudio**: Library for audio data processing in PyTorch.
- **Pillow**: Python Imaging Library (PIL) fork for image processing.

## Directory Format
```
└─── src
   ├── audio_dataset
   │   └── README.md
   ├── backend
   │   ├── main.py
   │   └── requirements.txt
   ├── dataset
   │   ├── README.md
   │   └── sample.py
   ├── frontend
   │   ├── bun.lock
   │   ├── main.ts
   │   ├── next.config.ts
   │   ├── next-env.d.ts
   │   ├── node_modules
   │   ├── package.json
   │   ├── postcss.config.mjs
   │   ├── public
   │   ├── README.md
   │   ├── src
   │   ├── tailwind.config.ts
   │   └── tsconfig.json
   └── model
       ├── api
       ├── audionet
       ├── image-export.py
       ├── mobilenet
       ├── requirements.txt
       ├── test
       └── weights
```

## Getting Started

Follow these steps to set up and run the EzTrain Platform locally.


### Prerequisites

- Python 3.10 or higher
- [pip](https://pip.pypa.io/en/stable/installation/)
- [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html)

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/akileshas/EzTrain.git
    cd EzTrain
    ```

2. **Set Up a Virtual Environment**:

    ```bash
    virtualenv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install Dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

### Configuration

Ensure that the `UPLOAD_DIR` in your application points to the desired directory for storing uploaded datasets. By default, it is set to a `dataset` folder in the project's root directory.

### Running the Application

Start the FastAPI application with SocketIO support:

```bash
uvicorn main:app --reload
```

The server will start on `http://127.0.0.1:8000/`.

## API Endpoints

### 1. Upload Images

- **Endpoint**: `/upload_images`
- **Method**: `POST`
- **Description**: Upload images for a specific class to train the model.
- **Payload**:

    ```json
    {
        "images": ["data:image/png;base64,...", "data:image/png;base64,..."],
        "class": "class_name"
    }
    ```

### 2. Train Model

- **Endpoint**: `/train`
- **Method**: `POST`
- **Description**: Initiate model training with specified parameters.
- **Payload**:

    ```json
    {
        "num_epochs": 10,
        "batch_size": 32,
        "learning_rate": 0.001
    }
    ```

### 3. Download Model Weights

- **Endpoint**: `/get_weights`
- **Method**: `GET`
- **Description**: Download the trained model weights.
- **Response**: Triggers a file download of the model weights.

## WebSocket Events

### 1. Upload Images

- **Event**: `upload_images`
- **Description**: Upload images for training via WebSocket.
- **Payload**:

    ```json
    {
        "images": ["data:image/png;base64,...", "data:image/png;base64,..."],
        "class": "class_name"
    }
    ```

### 2. Predict

- **Event**: `predict`
- **Description**: Send an image for real-time prediction.
- **Payload**:

    ```json
    {
        "image": "data:image/png;base64,..."
    }
    ```

- **Response**:

    ```json
    {
        "class": "predicted_class"
    }
    ```

## Contributing

We welcome contributions to enhance the Trainable AI Platform. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Elevate your AI projects with the Trainable AI Platform—where seamless integration meets powerful machine learning capabilities. 
