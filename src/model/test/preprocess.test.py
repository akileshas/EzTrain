import glob
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def test():
    import src.preprocess as pp

    image_path = os.path.join(
        os.path.dirname(__file__),
        "../../dataset/class-1/-XB1nkYr8x8_jpg.rf.8b7687ee2eacc4c31c1701dd312c21f0.jpg",
    )
    transform = pp.get_transform(
        augment=True,
    )
    tensor_image = pp.preprocess_image(image_path, transform)

    print("Processed Image Shape:", tensor_image.shape)
    print("Min/Max Pixel Values:", tensor_image.min().item(),
          tensor_image.max().item())


test()
