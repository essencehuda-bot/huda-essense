import re
import json

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[.*?\]);', content, re.DOTALL)
if match:
    products = json.loads(match.group(1))
    print(f"Total products: {len(products)}")
    
    for i, p in enumerate(products, 1):
        top = ", ".join(p.get('top', []))
        heart = ", ".join(p.get('heart', []))
        base = ", ".join(p.get('base', []))
        print(f"{i:2d}. [{p['id']}] {p['name']}")
        print(f"    Family: {p.get('family')} | Gender: {p.get('gender')}")
        print(f"    Notes -> Top: {top} | Heart: {heart} | Base: {base}")
        print(f"    Current image prop: {p.get('image')}\n")
