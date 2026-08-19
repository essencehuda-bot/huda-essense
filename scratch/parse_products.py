import json
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find JSON array structure of DEFAULT_PRODUCTS
match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);', content)
if match:
    json_str = match.group(1)
    try:
        products = json.loads(json_str)
        print(f"Total products in DEFAULT_PRODUCTS: {len(products)}")
        for p in products:
            print(f"- id: {p['id']}, name: {p['name']}, image: {p.get('image')}")
    except Exception as e:
        print("JSON parse error:", e)
else:
    print("DEFAULT_PRODUCTS match not found")
