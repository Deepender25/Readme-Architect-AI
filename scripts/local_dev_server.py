#!/usr/bin/env python3
"""
Local Development Server for ReadmeArchitect
This server handles Python API routes locally while proxying other requests to Next.js
"""

import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import requests
import threading
import time
from dotenv import load_dotenv

# Add the api directory to the path so we can import our handler
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))
from index import handler

# Load environment variables
load_dotenv()

class LocalDevHandler(BaseHTTPRequestHandler):
    """
    Local development handler that:
    1. Handles OAuth and API routes using the Python backend
    2. Proxies all other requests to the Next.js dev server
    """
    
    NEXTJS_PORT = 3000
    
    def do_GET(self):
        self._handle_request()
    
    def do_POST(self):
        self._handle_request()
        
    def do_DELETE(self):
        self._handle_request()
        
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
    
    def _handle_request(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Routes that should be handled by Python backend
        python_routes = [
            '/auth/',
            '/api/repositories',
            '/api/generate',
            '/api/history',
            '/api/python/'
        ]
        
        # Check if this should be handled by Python
        should_handle_python = any(parsed_url.path.startswith(route) for route in python_routes)
        
        if should_handle_python:
            self._handle_python_request()
        else:
            self._proxy_to_nextjs()
    
    def _handle_python_request(self):
        """Handle request using the Python backend"""
        try:
            # Create a mock request object that our Python handler expects
            python_handler = handler()
            
            # Set up the handler with our request data
            python_handler.path = self.path
            python_handler.command = self.command
            python_handler.headers = self.headers
            
            # Read request body if present
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                python_handler.rfile = self.rfile
            
            # Create a mock wfile that captures the response
            class MockWFile:
                def __init__(self):
                    self.data = b''
                
                def write(self, data):
                    self.data += data
            
            mock_wfile = MockWFile()
            
            # Capture the send_response calls
            responses = []
            headers = []
            
            def mock_send_response(code):
                responses.append(code)
                
            def mock_send_header(name, value):
                headers.append((name, value))
                
            def mock_end_headers():
                pass
            
            # Monkey patch the handler methods
            python_handler.send_response = mock_send_response
            python_handler.send_header = mock_send_header
            python_handler.end_headers = mock_end_headers
            python_handler.wfile = mock_wfile
            
            # Execute the Python handler
            python_handler.do_request()
            
            # Send the response
            if responses:
                self.send_response(responses[-1])
            else:
                self.send_response(200)
                
            for header_name, header_value in headers:
                self.send_header(header_name, header_value)
                
            self.end_headers()
            
            if mock_wfile.data:
                self.wfile.write(mock_wfile.data)
                
        except Exception as e:
            print(f"Error handling Python request: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(f'{{"error": "Internal server error: {str(e)}"}}'.encode())
    
    def _proxy_to_nextjs(self):
        """Proxy request to Next.js development server"""
        try:
            # Build the Next.js URL
            nextjs_url = f"http://localhost:{self.NEXTJS_PORT}{self.path}"
            
            # Prepare headers (exclude host header to avoid conflicts)
            headers = dict(self.headers)
            headers.pop('Host', None)
            
            # Read request body if present
            data = None
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                data = self.rfile.read(content_length)
            
            # Make the request to Next.js
            response = requests.request(
                method=self.command,
                url=nextjs_url,
                headers=headers,
                data=data,
                stream=True,
                timeout=30
            )
            
            # Send the response back
            self.send_response(response.status_code)
            
            # Forward response headers
            for header_name, header_value in response.headers.items():
                if header_name.lower() not in ['connection', 'transfer-encoding']:
                    self.send_header(header_name, header_value)
            
            self.end_headers()
            
            # Stream the response body
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    self.wfile.write(chunk)
                    
        except requests.exceptions.ConnectionError:
            # Next.js server might not be running
            self.send_response(503)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b'''
            <html>
                <body>
                    <h2>Next.js Development Server Not Running</h2>
                    <p>Please start the Next.js development server first:</p>
                    <code>npm run dev</code>
                    <p>Then refresh this page.</p>
                </body>
            </html>
            ''')
        except Exception as e:
            print(f"Error proxying to Next.js: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(f'Error proxying request: {str(e)}'.encode())

def check_nextjs_server():
    """Check if Next.js development server is running"""
    try:
        response = requests.get(f"http://localhost:3000", timeout=2)
        return True
    except:
        return False

def main():
    PORT = 8080
    
    print("🚀 Starting ReadmeArchitect Local Development Server")
    print(f"📡 Server will run on http://localhost:{PORT}")
    print()
    
    # Check if Next.js is running
    if check_nextjs_server():
        print("✅ Next.js development server detected on port 3000")
    else:
        print("⚠️  Next.js development server not detected on port 3000")
        print("   Please start it first with: npm run dev")
        print()
    
    print("🔧 Python API routes will be handled locally")
    print("🔄 All other routes will be proxied to Next.js")
    print()
    print("🌐 OAuth Flow:")
    print(f"   • Login: http://localhost:{PORT}/auth/github")
    print(f"   • Callback: http://localhost:{PORT}/auth/callback")
    print()
    print("📝 Configure your GitHub OAuth app with:")
    print(f"   Authorization callback URL: http://localhost:{PORT}/auth/callback")
    print()
    print("🛑 Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Create and start the server
    server = HTTPServer(('localhost', PORT), LocalDevHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\\n🛑 Shutting down the server...")
        server.shutdown()
        print("✅ Server stopped")

if __name__ == '__main__':
    main()
