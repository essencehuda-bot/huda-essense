from PIL import Image
import os

images_dir = "public/images"

templates = {
    "amber": "huda-essence-afnan-9-pm.jpg",
    "blue": "huda-essence-dior-sauvage.jpg",
    "brown": "huda-essence-chanel-allure-homme-sport.jpg",
    "silver": "huda-essence-creed-aventus.jpg",
    "green": "huda-essence-creed-green-irish-tweed.jpg",
    "teal": "huda-essence-ysl-y.jpg",
    "black": "huda-essence-la-nuit-de-l-homme.jpg"
}

# The name is located in y range [800, 960] and x range [250, 646]
y1, y2 = 800, 960
x1, x2 = 250, 646

for name, filename in templates.items():
    filepath = os.path.join(images_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {name}: file not found at {filepath}")
        continue
        
    print(f"Cleaning template: {name} ({filename})...")
    img = Image.open(filepath).convert("RGB")
    pixels = img.load()
    
    # Clean the name area using horizontal interpolation from sides
    for y in range(y1, y2):
        # We sample colors slightly outside the text bounds to avoid picking up the gold glow
        r_l, g_l, b_l = pixels[x1 - 25, y]
        r_r, g_r, b_r = pixels[x2 + 25, y]
        
        span = x2 - x1 + 1
        for x in range(x1, x2 + 1):
            t = (x - x1) / span
            r = int((1 - t) * r_l + t * r_r)
            g = int((1 - t) * g_l + t * g_r)
            b = int((1 - t) * b_l + t * b_r)
            pixels[x, y] = (r, g, b)
            
    out_path = os.path.join(images_dir, f"clean_base_{name}.jpg")
    img.save(out_path)
    print(f"Saved clean template to {out_path}")

print("All clean templates generated successfully!")
