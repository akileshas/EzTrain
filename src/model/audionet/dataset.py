import os
import sys

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchaudio
from torch.utils.data import DataLoader, Dataset
from torchaudio.transforms import MelSpectrogram

from .constants import ROOT_DATA_DIR


class AudioDataset(Dataset):
    def __init__(
        self,
        root_dir: str,
        transform=None,
    ):
        self.root_dir = root_dir
        self.transform = transform
        self.data = []
        self.labels = []
        self.class_map = {}

        for idx, class_name in enumerate(sorted(os.listdir(root_dir))):
            if class_name.startswith("class-"):
                self.class_map[class_name] = idx

        for class_name, label in self.class_map.items():
            class_dir = os.path.join(root_dir, class_name)
            for file_name in os.listdir(class_dir):
                if file_name.endswith(".wav"):
                    self.data.append(os.path.join(class_dir, file_name))
                    self.labels.append(label)

        def __len__(self):
            return len(self.data)

        def __getitem__(self, idx):
            file_path = self.data[idx]
            label = self.labels[idx]

            waveform, sample_rate = torchaudio.load(file_path)

            if self.transform:
                waveform = self.transform(waveform)

            return waveform, label


def get_classes(
    dataset_path: str = ROOT_DATA_DIR,
):
    class_dirs = [
        d
        for d in os.listdir(dataset_path)
        if os.path.isdir(os.path.join(dataset_path, d)) and d.startswith("class-")
    ]
    return {
        class_name: idx
        for idx, class_name in enumerate(
            sorted(
                class_dirs,
            )
        )
    }


def get_dataset(
    dataset_path: str = ROOT_DATA_DIR,
    transform=None,
):
    return AudioDataset(
        root_dir=dataset_path,
        transform=transform,
    )


def get_dataloader(
    batch_size: int = 32,
    dataset_path: str = ROOT_DATA_DIR,
    transform=None,
):
    dataset = get_dataset(
        dataset_path=dataset_path,
        transform=transform,
    )

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=4,
    )
