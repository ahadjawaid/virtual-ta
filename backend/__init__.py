from flask import Flask
import chromadb

app = Flask(__name__)

chroma = chromadb.PersistentClient(path="chromadb")

@app.route("/")
def home():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)