import re

app_file_path = "src/App.tsx"

print("Reading App.tsx...")
with open(app_file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Split by '{' to isolate each product block
blocks = text.split('{')
new_blocks = [blocks[0]]

updated_count = 0
for block in blocks[1:]:
    # Find "id" inside this block (limit search to avoid matching across blocks)
    id_match = re.search(r'"id":\s*"([^"]+)"', block[:300])
    if id_match:
        prod_id = id_match.group(1)
        # Check if the block has an "image" field
        if '"image":' in block:
            # Replace the image value with the new WebP path
            block = re.sub(
                r'"image":\s*"([^"]+)"', 
                f'"image": "/images/huda-essence-{prod_id}.webp"', 
                block, 
                count=1
            )
            updated_count += 1
    new_blocks.append(block)

# Join the blocks back
new_text = '{'.join(new_blocks)

# Save the updated App.tsx
with open(app_file_path, "w", encoding="utf-8") as f:
    f.write(new_text)

print(f"Successfully updated {updated_count} product image references in App.tsx using regex.")
