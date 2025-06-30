# check_models.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"Error configuring API. Is your GOOGLE_API_KEY set correctly in the .env file? Details: {e}")
    exit()

print("Listing available models that support 'generateContent'...\n")

# List all models and find the ones you can use for text generation
found_model = False
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"- {m.name}")
        found_model = True

if not found_model:
    print("\nCould not find any models supporting 'generateContent'.")
    print("Please check your API key permissions and Google AI project settings.")