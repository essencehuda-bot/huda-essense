import json

with open("scratch/product_catalog.json", "r", encoding="utf-8") as f:
    products = json.load(f)

color_map = {}
for p in products:
    color_map[p["color"]] = color_map.get(p["color"], 0) + 1

for color, count in sorted(color_map.items(), key=lambda x: x[1], reverse=True):
    print(f"{color}: {count}")
