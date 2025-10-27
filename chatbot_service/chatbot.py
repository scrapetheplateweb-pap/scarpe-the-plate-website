from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    
    return jsonify({"text": f"Echo: {message}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
