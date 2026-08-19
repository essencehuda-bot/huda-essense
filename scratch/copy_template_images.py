import json
import shutil
import os

# Load product catalog
with open("scratch/product_catalog.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# Source directory for generated template images
brain_dir = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1"
dest_dir = r"c:\Users\Asif\Downloads\huda-essense\public\images"

# Template images mapped by color
color_templates = {
    "rich amber gold": os.path.join(brain_dir, "huda_essence_afnan_9pm_1787137013486.jpg"),
    "deep blue": os.path.join(brain_dir, "huda_essence_dior_sauvage_1787137176927.jpg"),
    "warm amber brown": os.path.join(brain_dir, "huda_allure_homme_1787137399092.jpg"),
    "silver grey": os.path.join(brain_dir, "huda_essence_creed_aventus_1787137256986.jpg"),
    "emerald green": os.path.join(brain_dir, "huda_green_irish_tweed_1787137444113.jpg"),
    "teal green": os.path.join(brain_dir, "huda_ysl_y_1787137848504.jpg"),
    "deep black with subtle purple tint": os.path.join(brain_dir, "huda_la_nuit_1787138045655.jpg"),
}

# Map missing colors to closest available template
color_fallback = {
    "rich amber": "rich amber gold",
    "golden amber": "rich amber gold",
    "ruby red": "rich amber gold",
    "aqua blue": "deep blue",
    "light golden yellow": "rich amber gold",
    "deep cognac brown": "warm amber brown",
    "soft pink": "silver grey",          # lightest available
    "rose pink": "silver grey",          # lightest available  
    "warm peach amber": "rich amber gold",
    "clear with slight warm tint": "silver grey",
    "soft rose pink": "silver grey",
    "deep teal blue": "deep blue",
    "amber gold": "rich amber gold",
}

# Already generated products (skip these)
already_done = {
    "afnan-9-pm", "dior-sauvage", "bleu-de-chanel", 
    "chanel-allure-homme-sport", "creed-aventus",
    "creed-green-irish-tweed", "creed-silver-mountain",
    "armani-code", "acqua-di-gio", "stronger-with-you",
    "ysl-y", "la-nuit-de-l-homme"
}

copied = 0
skipped = 0
errors = 0

for p in products:
    pid = p["id"]
    color = p["color"]
    dest_file = os.path.join(dest_dir, f"huda-essence-{pid}.jpg")
    
    if pid in already_done:
        skipped += 1
        continue
    
    # Find template
    if color in color_templates:
        src = color_templates[color]
    elif color in color_fallback:
        src = color_templates[color_fallback[color]]
    else:
        print(f"WARNING: No template for color '{color}' (product: {pid})")
        # Default fallback
        src = color_templates["rich amber gold"]
        errors += 1
    
    try:
        shutil.copy2(src, dest_file)
        copied += 1
    except Exception as e:
        print(f"ERROR copying {pid}: {e}")
        errors += 1

print(f"\n=== RESULTS ===")
print(f"Total products: {len(products)}")
print(f"Already generated: {skipped}")
print(f"Copied with templates: {copied}")
print(f"Errors/warnings: {errors}")
print(f"Total images in folder: {len([f for f in os.listdir(dest_dir) if f.startswith('huda-essence-')])}")
