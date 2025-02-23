import os
import sys
import time

import torch

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def test():
    import mobilenet.constants as const
    import mobilenet.dataset as dataset
    import mobilenet.model as model
    import mobilenet.preprocess as procs
    from model.api import images as img
    from PIL import Image

    image_path = os.path.join(
        os.path.dirname(__file__),
        "../../dataset/class-1/-XB1nkYr8x8_jpg.rf.8b7687ee2eacc4c31c1701dd312c21f0.jpg",
    )
    image = Image.open(image_path).convert("RGB")

    transform = const.TRANSFORM
    transform_augmented = procs.get_transform(
        augment=True,
    )
    dir = const.ROOT_DATA_DIR
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    weights_path = os.path.join(
        os.path.dirname(__file__),
        "../weights/mobilenet_v1.pth",
    )

    classes_idx = dataset.get_classes(dir)
    classes = [cls.split("-")[-1] for cls in list(classes_idx.keys())]
    num_classes = len(classes)

    classifier_model = model.get_model(num_classes)
    classifier_model.load_state_dict(
        torch.load(
            weights_path,
            weights_only=True,
        ),
    ),
    classifier_model.eval()

    start = time.time()
    res = img.model_predict(
        classifier_model,
        transform_augmented,
        device,
        classes,
        image,
    )
    end = time.time()
    print(f"Prediction time: {end - start}")


test()
