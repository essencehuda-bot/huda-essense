from PIL import Image

img_path = r"public\images\huda-essence-dior-sauvage.jpg"
out_path = r"scratch\test_erased.jpg"

img = Image.open(img_path).convert("RGB")
width, height = img.size

# We want to erase the text in y range [800, 950] and x range [280, 616]
y1, y2 = 800, 950
x1, x2 = 280, 616

pixels = img.load()

for y in range(y1, y2):
    # Left reference pixel color
    r_l, g_l, b_l = pixels[x1 - 15, y]
    # Right reference pixel color
    r_r, g_r, b_r = pixels[x2 + 15, y]
    
    span = x2 - x1 + 1
    for x in range(x1, x2 + 1):
        t = (x - x1) / span
        r = int((1 - t) * r_l + t * r_r)
        g = int((1 - t) * r_l + t * r_r)  # Keep grey scale consistent if needed, but let's use the colors
        # Let's use the actual colors:
        r = int((1 - t) * r_l + t * r_r)
        g = int((1 - t) * g_l + t * g_r)
        b = int((1 - t) * b_l + t * b_r)
        pixels[x, y] = (r, g, b)

img.save(out_path)
print("Erase test with pure PIL completed!")
