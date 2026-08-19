import sys

query = "image"
with open("src/App.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if query in line:
            print(f"{i}: {line.strip()}")
            if i > 200: # Limit output
                break
