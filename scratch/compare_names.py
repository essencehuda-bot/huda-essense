import json
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);', content)
if match:
    products = json.loads(match.group(1))
    print(f"Total products: {len(products)}\n")
    for p in products:
        pid = p["id"]
        name = p["name"]
        inspired = p.get("inspiredBy", "")
        # Print if name is significantly different from inspiredBy or id
        print(f"[{pid}]  Name: '{name}'  |  InspiredBy: '{inspired}'")
