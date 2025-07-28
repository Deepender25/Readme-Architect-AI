#!/usr/bin/env python3
"""
Simple development server for testing the README generator locally.
This mimics the Vercel routing structure.
"""

import http.server
import socketserver
import urllib.parse
import os
import sys
from pathlib import Path

# Add the current directory to Python path so we can import our API modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.index import handler as IndexHandler
from api.generate import handler as GenerateHandler

class DevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="static", **kwargs)
    
    def do_GET(self):
        self.handle_request()
    
    def do_POST(self):
        self.handle_request()
    
    def handle_request(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        print(f"📡 Request: {self.command} {path}")
        
        # Route API requests
        if path.startswith('/api/generate'):
            print("🔄 Routing to generate handler")
            self.route_to_handler(GenerateHandler)
        elif path.startswith('/api/') or path.startswith('/auth/'):
            print("🔄 Routing to index handler")
            self.route_to_handler(IndexHandler)
        else:
            # Serve static files
            if path == '/':
                self.path = '/index.html'
            
            print(f"📁 Serving static file: {self.path}")
            super().do_GET()
    
    def route_to_handler(self, handler_class):
        """Route request to the appropriate API handler"""
        try:
            # Create a handler instance
            handler = handler_class(self, self.client_address, self.server)
            
            # Set up the handler with our request info
            handler.setup()
            handler.handle()
            handler.finish()
            
        except Exception as e:
            print(f"❌ Handler error: {e}")
            self.send_error(500, f"Internal server error: {str(e)}")

def main():
    PORT = 8001
    
    print(f"🚀 Starting development server on http://localhost:{PORT}")
    print("📁 Serving static files from ./static/")
    print("🔌 API endpoints:")
    print("   - /api/generate - README generation")
    print("   - /auth/github - GitHub OAuth")
    print("   - /auth/callback - OAuth callback")
    print("   - /api/repositories - User repositories")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), DevHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()