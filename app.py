import os
import json
from datetime import datetime
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"likes": 0, "comments": []}
    try:
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
            if "comments" not in data:
                data["comments"] = []
            return data
    except (json.JSONDecodeError, IOError):
        return {"likes": 0, "comments": []}

def save_data(data):
    try:
        with open(DATA_FILE, 'w') as file:
            json.dump(data, file, indent=4)
    except IOError as e:
        print(f"Error writing to database file: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/likes', methods=['GET'])
def get_likes():
    data = load_data()
    return jsonify({"likes": data.get("likes", 0)})

@app.route('/api/likes', methods=['POST'])
def add_like():
    data = load_data()
    data["likes"] = data.get("likes", 0) + 1
    save_data(data)
    return jsonify({"likes": data["likes"]})

@app.route('/api/comments', methods=['GET'])
def get_comments():
    data = load_data()
    return jsonify(data.get("comments", []))

@app.route('/api/comments', methods=['POST'])
def add_comment():
    req_data = request.get_json() or {}
    name = req_data.get("name", "").strip() or "Anonymous Guest"
    text = req_data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Comment message body cannot be empty."}), 400
    data = load_data()
    new_comment = {
        "name": name,
        "text": text,
        "date": datetime.now().strftime("%b %d, %Y - %I:%M %p")
    }
    
    data["comments"].insert(0, new_comment)
    save_data(data)
    
    return jsonify(data["comments"])

if __name__ == '__main__':
    app.run(debug=True)