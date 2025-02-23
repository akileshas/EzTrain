import os

from torch.utils.data import DataLoader, Dataset
from torchvision import datasets, transforms

from .constants import ROOT_DATA_DIR, TRANSFORM


def is_valid_class(directory):
    return directory.startswith("class-")


def get_classes(
    dataset_path: str = ROOT_DATA_DIR,
):
    class_dirs = [
        d
        for d in os.listdir(dataset_path)
        if os.path.isdir(os.path.join(dataset_path, d)) and is_valid_class(d)
    ]
    return {class_name: idx for idx, class_name in enumerate(sorted(class_dirs))}


class ImageDataset(Dataset):

    def __init__(self, dataset):
        self.dataset = dataset
        self.class_to_idx = {
            class_name: idx for idx, class_name in enumerate(dataset.classes)
        }
        self.classes = list(self.class_to_idx.keys())

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        image, label = self.dataset[idx]
        return image, label


def get_dataloader(
    batch_size: int = 32,
    dataset_path: str = ROOT_DATA_DIR,
    transform: transforms.Compose = TRANSFORM,
):
    class_dirs = get_classes(dataset_path)
    dataset = datasets.ImageFolder(
        root=dataset_path,
        transform=transform,
    )
    dataset = ImageDataset(dataset)

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=4,
    )
