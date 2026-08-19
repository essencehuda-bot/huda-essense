import json
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);', content)
if match:
    products = json.loads(match.group(1))
    print(f"Total products: {len(products)}")
    by_len = sorted(products, key=lambda p: len(p["name"]), reverse=True)
    print("\nLongest 25 product names:")
    for p in by_len[:25]:
        print(f"  ({len(p['name']):2d} chars) {p['name']}")
