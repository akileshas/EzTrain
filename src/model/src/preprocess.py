import glob
import json
import os
import sys
from typing import List

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image


def get_transform(
    image_size: List[int] = [224, 224],
    augment: bool = False,
) -> transforms.Compose:
    transforms_list = [
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[
                             0.229, 0.224, 0.225]),
    ]
    if augment:
        transforms_list.insert(1, transforms.RandomHorizontalFlip())

    return transforms.Compose(transforms_list)


def preprocess_image(
    image_path: str,
    transform: transforms.Compose,
) -> torch.Tensor:
    image = Image(image_path).convert("RGB")
    return transform(image).unsqueeze(0)
