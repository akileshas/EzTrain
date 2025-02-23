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
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.audio_files = []
        self.labels = []

        # Get class-to-index mapping from `get_classes()`
        self.class_to_idx = get_classes(root_dir)

        for class_name, label_idx in self.class_to_idx.items():
            class_path = os.path.join(root_dir, class_name)
            if os.path.isdir(class_path):
                for file in os.listdir(class_path):
                    if file.endswith(".wav"):
                        self.audio_files.append(os.path.join(class_path, file))
                        self.labels.append(label_idx)

    def __len__(self):
        return len(self.audio_files)

    def __getitem__(self, idx):
        audio_path = self.audio_files[idx]
        label = self.labels[idx]

        waveform, sample_rate = torchaudio.load(audio_path)

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


def collate_fn(batch):
    waveforms, labels = zip(*batch)

    max_len = max(wf.shape[-1] for wf in waveforms)

    waveforms = [
        (
            F.pad(wf, (0, max_len - wf.shape[-1]))
            if wf.shape[-1] < max_len
            else wf[..., :max_len]
        )
        for wf in waveforms
    ]

    return torch.stack(waveforms), torch.tensor(labels)


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
        collate_fn=collate_fn,
    )


def get_transform():
    return MelSpectrogram(
        sample_rate=16000,
        n_fft=400,
        win_length=400,
        hop_length=160,
        f_min=0,
        f_max=8000,
        n_mels=64,
    )
