import re
import json

app_file_path = "src/App.tsx"

with open(app_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate DEFAULT_PRODUCTS block
start_match = re.search(r"const DEFAULT_PRODUCTS:\s*Product\[\]\s*=\s*\[", content)
start_idx = start_match.end()

# Bracket matcher to find the end of the array
bracket_count = 1
end_idx = start_idx
while bracket_count > 0 and end_idx < len(content):
    char = content[end_idx]
    if char == '[':
        bracket_count += 1
    elif char == ']':
        bracket_count -= 1
    end_idx += 1

products_array_str = content[start_idx:end_idx-1].strip()

# Find all object blocks
objects = []
idx = 0
while idx < len(products_array_str):
    if products_array_str[idx] == '{':
        obj_start = idx
        obj_bracket_count = 1
        idx += 1
        while obj_bracket_count > 0 and idx < len(products_array_str):
            c = products_array_str[idx]
            if c == '{':
                obj_bracket_count += 1
            elif c == '}':
                obj_bracket_count -= 1
            idx += 1
        obj_str = products_array_str[obj_start:idx]
        objects.append(obj_str)
    else:
        idx += 1

# Parse each product
products = []
for obj_str in objects:
    cleaned = obj_str.strip().rstrip(',').strip()
    try:
        p = json.loads(cleaned)
        products.append({
            "id": p["id"],
            "name": p["name"],
            "family": p.get("family", ""),
            "gender": p.get("gender", ""),
            "inspiredBy": p.get("inspiredBy", ""),
        })
    except:
        pass

# Assign colors based on fragrance family and name
def get_bottle_color(p):
    family = p["family"].lower()
    name = p["name"].lower()
    
    # Specific color assignments based on fragrance identity
    if any(w in name for w in ["sauvage", "bleu", "blue", "dylan blue", "chrome", "cool water", "acqua", "light blue", "hawas"]):
        return "deep blue"
    if any(w in name for w in ["oud", "amber", "tobacco", "tuscan", "asad", "khamrah", "sheikh"]):
        return "rich amber"
    if any(w in name for w in ["rose", "miss dior", "mon paris", "chance", "flora", "bloom", "garden", "cherry"]):
        return "rose pink"
    if any(w in name for w in ["green", "tweed", "vetiver"]):
        return "emerald green"
    if any(w in name for w in ["black", "noir", "intense", "opium", "poison", "nuit", "afghano"]):
        return "deep black with subtle purple tint"
    if any(w in name for w in ["gold", "million", "wanted", "boss", "icon"]):
        return "golden amber"
    if any(w in name for w in ["red", "rouge", "ruby", "desire"]):
        return "ruby red"
    if any(w in name for w in ["silver", "platinum", "mountain", "creed"]):
        return "silver grey"
    if any(w in name for w in ["white", "musk", "clean"]):
        return "clear with slight warm tint"
    
    # Family-based fallback
    if "aquatic" in family or "marine" in family:
        return "aqua blue"
    if "woody" in family or "oud" in family:
        return "warm amber brown"
    if "floral" in family or "rose" in family:
        return "soft pink"
    if "oriental" in family or "amber" in family or "spicy" in family or "vanilla" in family:
        return "rich amber gold"
    if "citrus" in family or "fresh" in family:
        return "light golden yellow"
    if "aromatic" in family or "fougere" in family or "green" in family:
        return "teal green"
    if "leather" in family:
        return "deep cognac brown"
    if "fruity" in family or "gourmand" in family:
        return "warm peach amber"
    
    # Gender-based fallback
    if p["gender"] == "Women":
        return "soft rose pink"
    if p["gender"] == "Men":
        return "deep teal blue"
    return "amber gold"

for p in products:
    p["color"] = get_bottle_color(p)

# Output as JSON
with open("scratch/product_catalog.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(products)} products")
for p in products[:5]:
    print(f"  {p['id']}: {p['name']} -> {p['color']}")
print(f"  ...")
for p in products[-3:]:
    print(f"  {p['id']}: {p['name']} -> {p['color']}")
