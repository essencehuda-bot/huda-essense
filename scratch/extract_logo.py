import cv2
import numpy as np
from PIL import Image

# Path to the uploaded reference image
img_path = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1\.user_uploaded\media_1787110102456.jpg"

# Load image
img = cv2.imread(img_path)
h, w, _ = img.shape

# Convert to HSV and LAB
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

# The checkerboard consists of neutral grey/white pixels (low saturation in HSV and a/b channels in LAB near 128)
# Gold pixels have high yellow/orange hue and significant saturation/chroma
# Specifically, in HSV: Hue ~ 10-45 (yellow/gold/amber), Saturation > 25
# Or in LAB: b* (yellow-blue channel) > 135

# Let's inspect saturation and yellow-blue channel
sat = hsv[:, :, 1]
b_chan = lab[:, :, 2]
a_chan = lab[:, :, 1]

# Chroma distance from neutral (128, 128 in LAB)
chroma = np.sqrt((a_chan.astype(np.float32) - 128)**2 + (b_chan.astype(np.float32) - 128)**2)

# Gold has high chroma and positive b_chan (yellow)
# Also spray particles might have slight warmth
gold_mask = (b_chan > 132) | (sat > 30) | (chroma > 8)

# Smooth alpha transition
alpha = np.clip((chroma - 5) / 12.0 * 255.0, 0, 255).astype(np.uint8)

# Keep strong gold fully opaque
alpha[chroma > 18] = 255
alpha[b_chan > 140] = 255
alpha[chroma < 4] = 0

# Convert BGR to RGBA
b, g, r = cv2.split(img)
rgba = cv2.merge([r, g, b, alpha])

# Save as PNG
out_img = Image.fromarray(rgba)

# Crop transparent borders if needed
bbox = out_img.getbbox()
if bbox:
    # Add a slight padding
    pad = 10
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad)
    )
    cropped = out_img.crop(crop_box)
else:
    cropped = out_img

cropped.save(r"c:\Users\Asif\Downloads\huda-essense\public\images\huda_essence_logo.png")
print("Saved public/images/huda_essence_logo.png with size:", cropped.size)
