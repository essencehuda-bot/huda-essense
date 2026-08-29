import os
from PIL import Image

for f in sorted(os.listdir('public/images')):
    if f.startswith('base_') or f.startswith('clean_base_'):
        path = os.path.join('public/images', f)
        img = Image.open(path)
        print(f"{f}: size={img.size}, mode={img.mode}")
