from flask import Flask, request, jsonify
app = Flask(__name__)
@app.route("/chat", methods=["POST"])
def chat():
    return jsonify({"text":"GPT Chatbot placeholder"})
if __name__=="__main__":
    app.run(port=5001, debug=True)
