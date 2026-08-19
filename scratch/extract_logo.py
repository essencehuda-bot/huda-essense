from PIL import Image
import numpy as np

img_path = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1\.user_uploaded\media_1787110102456.jpg"

img = Image.open(img_path).convert("RGBA")
arr = np.array(img, dtype=np.float32)

r = arr[:, :, 0]
g = arr[:, :, 1]
b = arr[:, :, 2]

# Measure saturation / warm color distance from grey
# Grey pixels have r ≈ g ≈ b
# Gold pixels have r > g > b, strong warmth (r - b is high, r - g is moderate)
rg_diff = r - g
rb_diff = r - b
gb_diff = g - b

# Color distance from neutral
max_c = np.maximum(np.maximum(r, g), b)
min_c = np.minimum(np.minimum(r, g), b)
saturation = np.where(max_c > 0, (max_c - min_c) / max_c, 0) * 255.0

# Gold color criteria:
# 1. Warmth: rb_diff > 20 and r > 100
# 2. Saturation: saturation > 25
# 3. Non-grey: (max_c - min_c) > 15
warmth = (rb_diff > 18) & (r > 80)
is_gold = warmth & (saturation > 20) & ((max_c - min_c) > 12)

# Compute smooth alpha
alpha = np.zeros_like(r)
# Ramp from 12 to 35 difference
alpha_diff = np.clip((rb_diff - 12) / 20.0, 0, 1)
alpha_sat = np.clip((saturation - 15) / 25.0, 0, 1)
alpha = alpha_diff * alpha_sat * 255.0

# Strong gold is fully opaque
alpha[(rb_diff > 28) & (saturation > 30)] = 255.0
alpha[~warmth] = 0.0

# Clean up edges and set alpha
arr[:, :, 3] = np.clip(alpha, 0, 255)

out_img = Image.fromarray(arr.astype(np.uint8))
bbox = out_img.getbbox()
if bbox:
    pad = 12
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(out_img.width, bbox[2] + pad),
        min(out_img.height, bbox[3] + pad)
    )
    cropped = out_img.crop(crop_box)
else:
    cropped = out_img

cropped.save(r"c:\Users\Asif\Downloads\huda-essense\public\images\huda_essence_logo.png")
print("Successfully saved public/images/huda_essence_logo.png with size:", cropped.size)
