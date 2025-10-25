from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            self.handle_diagnostic()
        except Exception as e:
            print(f"ERROR in diagnostic: {str(e)}")
            self.send_json_response({"error": f"Diagnostic error: {str(e)}"}, 500)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def handle_diagnostic(self):
        diagnostic_info = {
            "python_version": sys.version,
            "python_path": sys.path,
            "environment_variables": {},
            "installed_packages": {},
            "import_tests": {}
        }
        
        # Check environment variables
        env_vars_to_check = ["GOOGLE_API_KEY", "GITHUB_CLIENT_ID", "DATABASE_URL"]
        for var in env_vars_to_check:
            value = os.environ.get(var)
            if value:
                diagnostic_info["environment_variables"][var] = f"{value[:10]}..." if len(value) > 10 else value
            else:
                diagnostic_info["environment_variables"][var] = "NOT SET"
        
        # Test package imports
        packages_to_test = [
            "requests",
            "google.generativeai",
            "python-dotenv",
            "zipfile",
            "tempfile",
            "ast"
        ]
        
        for package in packages_to_test:
            try:
                if package == "python-dotenv":
                    import dotenv
                    diagnostic_info["import_tests"][package] = "✅ SUCCESS"
                elif package == "google.generativeai":
                    import google.generativeai as genai
                    diagnostic_info["import_tests"][package] = "✅ SUCCESS"
                else:
                    __import__(package)
                    diagnostic_info["import_tests"][package] = "✅ SUCCESS"
            except Exception as e:
                diagnostic_info["import_tests"][package] = f"❌ FAILED: {str(e)}"
        
        # Test Google AI configuration
        try:
            import google.generativeai as genai
            api_key = os.environ.get("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-flash-latest')
                diagnostic_info["google_ai_test"] = "✅ Configuration successful"
            else:
                diagnostic_info["google_ai_test"] = "❌ No API key"
        except Exception as e:
            diagnostic_info["google_ai_test"] = f"❌ Failed: {str(e)}"
        
        # Test simple AI generation
        try:
            import google.generativeai as genai
            api_key = os.environ.get("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-flash-latest')
                response = model.generate_content("Say hello")
                if response.parts:
                    diagnostic_info["ai_generation_test"] = f"✅ SUCCESS: {response.text[:50]}..."
                else:
                    diagnostic_info["ai_generation_test"] = "❌ No response parts (safety filters?)"
            else:
                diagnostic_info["ai_generation_test"] = "❌ No API key"
        except Exception as e:
            diagnostic_info["ai_generation_test"] = f"❌ Failed: {str(e)}"
        
        # Test file operations
        try:
            import tempfile
            import os
            temp_dir = tempfile.mkdtemp()
            test_file = os.path.join(temp_dir, "test.txt")
            with open(test_file, 'w') as f:
                f.write("test")
            with open(test_file, 'r') as f:
                content = f.read()
            os.remove(test_file)
            os.rmdir(temp_dir)
            diagnostic_info["file_operations_test"] = "✅ SUCCESS"
        except Exception as e:
            diagnostic_info["file_operations_test"] = f"❌ Failed: {str(e)}"
        
        # Test network requests
        try:
            import requests
            response = requests.get("https://httpbin.org/get", timeout=10)
            if response.status_code == 200:
                diagnostic_info["network_test"] = "✅ SUCCESS"
            else:
                diagnostic_info["network_test"] = f"❌ HTTP {response.status_code}"
        except Exception as e:
            diagnostic_info["network_test"] = f"❌ Failed: {str(e)}"
        
        self.send_json_response(diagnostic_info)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())