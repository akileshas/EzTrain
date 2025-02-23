import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))


def test():
    import mobilenet.preprocess as pp
    from PIL import Image

    image_path = os.path.join(
        os.path.dirname(__file__),
        "../../dataset/class-1/-XB1nkYr8x8_jpg.rf.8b7687ee2eacc4c31c1701dd312c21f0.jpg",
    )
    image_pil = Image.open(image_path).convert("RGB")
    transform = pp.get_transform(
        augment=True,
    )
    tensor_image_pil = pp.preprocess_pil_image(
        image_pil,
        transform,
    )
    tensor_image = pp.preprocess_image(image_path, transform)

    print("PIL Image Shape:", tensor_image_pil.shape)
    print(
        "Min/Max Pixel Values:",
        tensor_image_pil.min().item(),
        tensor_image_pil.max().item(),
    )
    print("Processed Image Shape:", tensor_image.shape)
    print("Min/Max Pixel Values:", tensor_image.min().item(),
          tensor_image.max().item())


test()
