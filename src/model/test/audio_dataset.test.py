import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def test():
    import audionet.dataset as dataset

    classes_idx = dataset.get_classes()
    num_classes = len(classes_idx)
    print(classes_idx)

    transform = dataset.get_transform()
    dataloader = dataset.get_dataloader(
        batch_size=32,
        transform=transform,
    )

    all_labels = []

    for batch in dataloader:
        waveforms, labels = batch
        all_labels.extend(labels.tolist())

    print(set(all_labels))


test()
