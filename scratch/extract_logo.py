from PIL import Image

img_path = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1\.user_uploaded\media_1787110102456.jpg"

img = Image.open(img_path).convert("RGBA")
pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # Calculate color differences
        rb_diff = r - b
        rg_diff = r - g
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        chroma = max_c - min_c
        
        # Neutral grey / white checkerboard has chroma < 12 and rb_diff < 12
        if rb_diff > 18 and chroma > 16 and r > 80:
            # Gold color
            if rb_diff > 28 and chroma > 28:
                alpha = 255
            else:
                alpha = int(min(255, max(0, (rb_diff - 12) / 20.0 * 255)))
            pixels[x, y] = (r, g, b, alpha)
        else:
            pixels[x, y] = (0, 0, 0, 0)

bbox = img.getbbox()
if bbox:
    pad = 12
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(width, bbox[2] + pad),
        min(height, bbox[3] + pad)
    )
    cropped = img.crop(crop_box)
else:
    cropped = img

cropped.save(r"c:\Users\Asif\Downloads\huda-essense\public\images\huda_essence_logo.png", "PNG")
print("Successfully saved public/images/huda_essence_logo.png with size:", cropped.size)
