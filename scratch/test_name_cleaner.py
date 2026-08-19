import json
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);', content)

def get_bottle_display_name(name):
    clean = name
    # Remove (Unisex), (Men), (Women)
    clean = re.sub(r'\s*\([^)]*\)', '', clean)
    
    # Prefix strippers for clean bottle label formatting
    prefixes = [
        "Jo Malone ", "Maison Francis ", "Carolina Herrera ", 
        "Victoria's Secret ", "Dolce & Gabbana ", "Issey Miyake ", 
        "Tom Ford ", "Scents N Stories ", "WB by Hemani ", 
        "Bonanza Satrangi ", "Armaf ", "Lattafa ", "Ajmal ",
        "Mont Blanc ", "Paco Rabanne ", "Byredo ", "Mancera ",
        "Montale ", "Initio ", "Xerjoff ", "Le Labo ", "Memo ",
        "Amouage ", "Nishane "
    ]
    
    # Strip brand prefix if remaining text is at least 4 characters
    for p in prefixes:
        if clean.startswith(p) and len(clean) - len(p) >= 4:
            clean = clean[len(p):]
            break
            
    return clean.strip()

if match:
    products = json.loads(match.group(1))
    print(f"Total products: {len(products)}")
    print("\nBefore vs After Bottle Label Cleaning:")
    for p in products:
        orig = p["name"]
        cleaned = get_bottle_display_name(orig)
        if orig != cleaned:
            print(f"  {orig:<36} ->  '{cleaned}'")
