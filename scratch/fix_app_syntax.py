app_file_path = "src/App.tsx"

with open(app_file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the corrupted braces with standard formatting
fixed_text = text.replace("}  },    {", "},\n    {")

with open(app_file_path, "w", encoding="utf-8") as f:
    f.write(fixed_text)

print("Syntax fix completed. Verifying compilation...")
