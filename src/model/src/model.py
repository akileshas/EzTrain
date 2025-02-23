import torch
import torch.nn as nn
import torchvision.models as models
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
):
    model.eval()
    model.to(device)
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
        return predicted.item()
