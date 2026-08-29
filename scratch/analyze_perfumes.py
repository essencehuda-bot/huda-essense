import re
import json
import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[.*?\]);', content, re.DOTALL)
if match:
    products_json = match.group(1)
    products = json.loads(products_json)
    print(f"Total products found: {len(products)}")
    
    families = set(p.get('family', '') for p in products)
    print(f"\nTotal unique families: {len(families)}")
    print("\nProduct Families:")
    for fam in sorted(families):
        count = sum(1 for p in products if p.get('family') == fam)
        print(f" - {fam} ({count} products)")

    print("\nImages set in products:")
    images = {}
    for p in products:
        img = p.get('image', '')
        exists = os.path.exists(os.path.join('public', img.lstrip('/'))) if img else False
        images[img] = images.get(img, 0) + 1

    print(f"Total distinct image paths referenced: {len(images)}")

    print("\nSample Products:")
    for p in products:
        print(f"ID: {p['id']} | Name: {p['name']} | Family: {p.get('family')} | Image: {p.get('image')}")
        print(f"   Top: {p.get('top')} | Heart: {p.get('heart')} | Base: {p.get('base')}")
else:
    print("Could not find DEFAULT_PRODUCTS")
