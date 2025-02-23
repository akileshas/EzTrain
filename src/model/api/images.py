import os
import sys

import PIL
import torch

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def train(
    num_epochs: int = 5,
    batch_size: int = 32,
    learning_rate: float = 0.001,
):
    import mobilenet.constants as const
    import mobilenet.dataset as dataset
    import mobilenet.model as model
    import mobilenet.preprocess as procs
    import mobilenet.train as train

    transform = const.TRANSFORM
    dir = const.ROOT_DATA_DIR

    try:
        classes_idx = dataset.get_classes(
            dataset_path=dir,
        )
        classes = [cls.split("-")[-1] for cls in list(classes_idx.keys())]
        num_classes = len(classes)

        dataloader = dataset.get_dataloader(
            batch_size=batch_size,
            dataset_path=dir,
            transform=transform,
        )

        classifier_model = model.get_model(
            num_classes=num_classes,
        )

        train_loss = train.train_model(
            model=classifier_model,
            dataloader=dataloader,
            num_epochs=num_epochs,
            learning_rate=learning_rate,
        )

        torch.save(
            classifier_model.state_dict(),
            os.path.join(
                os.path.dirname(__file__),
                "../weights/mobilenet_v1.pth",
            ),
        )

        return True, train_loss

    except Exception:
        return False


def predict(
    image,
):
    import mobilenet.constants as const
    import mobilenet.dataset as dataset
    import mobilenet.model as model
    import mobilenet.preprocess as procs
    import mobilenet.train as train

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

    try:
        classes_idx = dataset.get_classes(
            dataset_path=dir,
        )
        classes = [cls.split("-")[-1] for cls in list(classes_idx.keys())]
        num_classes = len(classes)

        classifier_model = model.get_model(
            num_classes=num_classes,
        )

        classifier_model.load_state_dict(
            torch.load(
                weights_path,
                weights_only=True,
            ),
        ),
        classifier_model.eval()

        tensor_image = procs.preprocess_pil_image(
            image=image,
            transform=transform_augmented,
        )
        tensor_image = tensor_image.to(device)

        prediction_probabilities, prediction_idx = model.predict(
            model=classifier_model,
            image=tensor_image,
            device=device,
            class_labels=classes,
        )
        prediction_class = classes[prediction_idx]

        return (
            True,
            prediction_idx,
            prediction_class,
            prediction_probabilities,
        )

    except Exception:
        return False


def model_predict(
    classifier_model,
    transform_augmented,
    device,
    classes,
    image,
):
    import mobilenet.model as model
    import mobilenet.preprocess as procs

    try:
        classifier_model.eval()

        tensor_image = procs.preprocess_pil_image(
            image=image,
            transform=transform_augmented,
        )
        tensor_image = tensor_image.to(device)

        prediction_probabilities, prediction_idx = model.predict(
            model=classifier_model,
            image=tensor_image,
            device=device,
            class_labels=classes,
        )
        prediction_class = classes[prediction_idx]

        return (
            True,
            prediction_idx,
            prediction_class,
            prediction_probabilities,
        )
    except Exception:
        return False
