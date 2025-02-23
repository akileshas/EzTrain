import os
import sys

import torch

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def test():
    import mobilenet.dataset as dataset
    import mobilenet.model as model
    import mobilenet.preprocess as pp
    import mobilenet.train as train

    # Load the dataset
    dataloader = dataset.get_dataloader()

    # Load the model
    classifier = model.get_model(num_classes=2)

    # train the model
    train.train_model(
        classifier,
        dataloader,
        num_epochs=10,
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    predict_img = os.path.join(
        os.path.dirname(__file__),
        "../../dataset/class-2/-_jpg.rf.255402a0e8a5294cfd0e02c42e37ecc7.jpg",
    )
    transform = pp.get_transform(
        augment=True,
    )
    tensor_img = pp.preprocess_image(
        predict_img,
        transform,
    )
    tensor_img = tensor_img.to(device)
    pred = model.predict(
        classifier,
        tensor_img,
        device="cuda",
    )
    print(pred)

    torch.save(classifier.state_dict(), "../weights/v1.pth")


test()
