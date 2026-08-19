import json
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);', content)
if match:
    products = json.loads(match.group(1))
    for p in products:
        name = p["name"]
        inspired = p.get("inspiredBy", "")
        if "\ufffd" in name or "\ufffd" in inspired or "" in name or "" in inspired:
            print(f"Corrupted ID: {p['id']}, Name: {repr(name)}, InspiredBy: {repr(inspired)}")
