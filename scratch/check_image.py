from PIL import Image

img_path = r"public\images\huda-essence-dior-sauvage.jpg"
try:
    with Image.open(img_path) as img:
        print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
except Exception as e:
    print(f"Error: {e}")
