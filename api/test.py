from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/")
async def root():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>AutoDoc AI - Working!</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px;
                background: #1a1a1a;
                color: white;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background: #2a2a2a;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 AutoDoc AI is Working!</h1>
            <p>Your Vercel deployment is successful.</p>
            <p>The serverless function is running properly.</p>
        </div>
    </body>
    </html>
    """)

@app.get("/api/test")
async def test():
    return {"message": "API is working!", "status": "success"}