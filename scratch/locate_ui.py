with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in App.tsx: {len(lines)}")
for i, line in enumerate(lines):
    if 'function App' in line or 'export default' in line:
        print(f"Line {i+1}: {line.strip()}")
    if i > 5495 and ('modal' in line.lower() or 'perfume' in line.lower() or 'image' in line.lower() or 'notes' in line.lower()):
        print(f"Line {i+1}: {line.strip()[:100].encode('ascii', 'ignore').decode('ascii')}")
