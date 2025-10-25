from http.server import BaseHTTPRequestHandler
import json
import sys
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            self.handle_diagnostic()
        except Exception as e:
            error_msg = f"Diagnostic error: {str(e)}"
            self.send_json_response({"error": error_msg}, 500)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def handle_diagnostic(self):
        diagnostic_info = {
            "python_version": sys.version,
            "import_tests": {},
            "environment_variables": {}
        }
        
        # Check environment variables
        env_vars_to_check = ["GOOGLE_API_KEY", "GITHUB_CLIENT_ID"]
        for var in env_vars_to_check:
            value = os.environ.get(var)
            if value:
                diagnostic_info["environment_variables"][var] = f"{value[:10]}..." if len(value) > 10 else value
            else:
                diagnostic_info["environment_variables"][var] = "NOT SET"
        
        # Test basic imports first
        basic_packages = ["requests", "zipfile", "tempfile", "ast"]
        for package in basic_packages:
            try:
                __import__(package)
                diagnostic_info["import_tests"][package] = "✅ SUCCESS"
            except Exception as e:
                diagnostic_info["import_tests"][package] = f"❌ FAILED: {str(e)}"
        
        # Test dotenv import
        try:
            from dotenv import load_dotenv
            diagnostic_info["import_tests"]["dotenv"] = "✅ SUCCESS"
        except Exception as e:
            diagnostic_info["import_tests"]["dotenv"] = f"❌ FAILED: {str(e)}"
        
        # Test Google AI import
        try:
            import google.generativeai as genai
            diagnostic_info["import_tests"]["google.generativeai"] = "✅ SUCCESS"
            
            # Test configuration
            api_key = os.environ.get("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                diagnostic_info["google_ai_config"] = "✅ Configuration successful"
                
                # Test model initialization
                try:
                    model = genai.GenerativeModel('gemini-flash-latest')
                    diagnostic_info["google_ai_model"] = "✅ Model initialized"
                except Exception as e:
                    diagnostic_info["google_ai_model"] = f"❌ Model failed: {str(e)}"
            else:
                diagnostic_info["google_ai_config"] = "❌ No API key"
                
        except Exception as e:
            diagnostic_info["import_tests"]["google.generativeai"] = f"❌ FAILED: {str(e)}"
        
        self.send_json_response(diagnostic_info)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())