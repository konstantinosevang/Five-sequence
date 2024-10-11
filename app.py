# app.py

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import logging
import os

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Configure logging
log_file = 'game_logs.txt'
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    else:
        return jsonify({"error": "File not found."}), 404

@app.route('/log_move', methods=['POST'])
def log_move():
    try:
        data = request.get_json()
        move = data.get('move', 'No move description provided.')
        logging.info(move)
        return jsonify({"status": "success", "message": "Move logged."}), 200
    except Exception as e:
        logging.error(f"Error logging move: {e}")
        return jsonify({"status": "error", "message": "Failed to log move."}), 500

if __name__ == '__main__':
    # Ensure the log file exists
    if not os.path.exists(log_file):
        open(log_file, 'w').close()
    app.run(host='0.0.0.0', port=5000)
