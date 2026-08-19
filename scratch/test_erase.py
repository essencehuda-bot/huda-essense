from PIL import Image
import numpy as np

img_path = r"public\images\huda-essence-dior-sauvage.jpg"
out_path = r"scratch\test_erased.jpg"

img = Image.open(img_path)
data = np.array(img)

# We want to erase the text in y range [750, 950] and x range [280, 616]
# Let's do horizontal interpolation to fill this box from the sides
y1, y2 = 800, 950
x1, x2 = 280, 616

for y in range(y1, y2):
    # Left reference pixel color
    left_color = data[y, x1 - 1].astype(float)
    # Right reference pixel color
    right_color = data[y, x2 + 1].astype(float)
    
    # Interpolate
    width = x2 - x1 + 1
    for x in range(x1, x2 + 1):
        t = (x - x1) / width
        color = (1 - t) * left_color + t * right_color
        data[y, x] = color.astype(np.uint8)

erased_img = Image.fromarray(data)
erased_img.save(out_path)
print("Erase test completed!")
