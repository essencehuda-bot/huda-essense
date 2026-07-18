import os
from google import genai

print("Google GenAI SDK imported successfully.")
print("Env vars:", [k for k in os.environ.keys() if "GOOGLE" in k or "GEMINI" in k])

try:
    # Try to initialize client
    client = genai.Client()
    print("Client initialized successfully.")
    
    # Try a simple text generation
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='Hello'
    )
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
