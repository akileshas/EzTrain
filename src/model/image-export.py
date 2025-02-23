import torch
import torch.nn as nn
import torch.optim as optim
from PIL import Image
from torch.nn import functional as F
from torchvision import datasets, models, transforms
from torchvision.models.mobilenet import MobileNet_V2_Weights


# Model Definition
class ClassifierModel(nn.Module):
    def __init__(
        self,
        num_classes: int,
        dropout: float = 0.2,
    ):
        super(ClassifierModel, self).__init__()

        mobilenet_weights = MobileNet_V2_Weights.IMAGENET1K_V1
        self.backbone = models.mobilenet_v2(
            weights=mobilenet_weights,
        )
        self.backbone.classifier = nn.Identity()

        self.classifier = nn.Sequential(
            nn.Linear(self.backbone.last_channel, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.backbone(x)
        x = self.classifier(x)
        return x


# Model Parameters
# NOTE: Updated the model parameters as your needs.
num_classes = 2
classes = ["cat", "dog"]
dropout = 0.2
image_path = "sample.jpg"
weight_path = "model.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
augmentation = False

# Load model weights
classifier_model = ClassifierModel(
    num_classes=num_classes,
    dropout=dropout,
)
classifier_model.load_state_dict(
    torch.load(
        weight_path,
        weights_only=True,
    ),
)

# Load the model to the device
classifier_model.to(device)

# Image Preprocessing Pipeline
image_transform_list = [
    transforms.Resize([224, 224]),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
]
if augmentation:
    image_transform_list.insert(
        1,
        transforms.RandomHorizontalFlip(),
    )
image_transform = transforms.Compose(image_transform_list)

# Load the image
image = Image.open(image_path).convert("RGB")
image = image_transform(image).unsqueeze(0).to(device)

# Perform inference
classifier_model.eval()
with torch.no_grad():
    logits = classifier_model(image)
    probabilities = F.softmax(logits, dim=1)
    probabilities = probabilities.cpu().numpy().tolist()[0]
    predicted_class_idx = torch.argmax(logits, dim=1).cpu().numpy()[0]

# Output the prediction
print(f"Predicted Class Index: {predicted_class_idx}")
print(f"Predicted Class: {classes[predicted_class_idx]}")
