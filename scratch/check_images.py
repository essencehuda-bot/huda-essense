import os
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Match id: 'something' or id: "something"
matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
ids = sorted(list(set(matches)))

print(f"Total unique product IDs in App.tsx: {len(ids)}")

found = []
missing = []
for pid in ids:
    path = f"public/images/huda-essence-{pid}.jpg"
    if os.path.exists(path):
        found.append(pid)
    else:
        missing.append(pid)

print(f"Found pre-rendered huda-essence images: {len(found)}")
print(f"Missing pre-rendered huda-essence images: {len(missing)}")
if missing:
    print("Missing IDs:", missing)
