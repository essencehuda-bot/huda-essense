import re
import json

# Read App.tsx
with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Load product catalog for reference
with open("scratch/product_catalog.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# Replace all .webp image paths with .jpg
# Pattern: "/images/huda-essence-PRODUCT_ID.webp" -> "/images/huda-essence-PRODUCT_ID.jpg"
new_content = content.replace('.webp"', '.jpg"')

# Count replacements
webp_count = content.count('.webp"')
jpg_count = new_content.count('.jpg"')

print(f"Replaced {webp_count} .webp references with .jpg")
print(f"Total .jpg references now: {jpg_count}")

# Write updated App.tsx
with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("App.tsx updated successfully!")
