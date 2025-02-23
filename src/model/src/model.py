import torch
import torch.nn as nn
import torchvision.models as models
from torch.nn import functional as F
from torchvision.models.mobilenetv2 import MobileNet_V2_Weights


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


def get_model(num_classes: int):
    return ClassifierModel(num_classes=num_classes)


def predict(
    model,
    image,
    device,
    class_labels,
):
    model.eval()
    model.to(device)
    with torch.no_grad():
        output = model(image)
        probabilities = F.softmax(output, dim=1)
        probabilities = probabilities.cpu().numpy().tolist()[0]
        predicted_class = torch.argmax(output, dim=1).cpu().numpy()[0]

    result = [
        {
            "class": class_labels[i].split("-")[-1],
            "percent": round(prob * 100, 2),
        }
        for i, prob in enumerate(probabilities)
    ]

    return result, predicted_class
