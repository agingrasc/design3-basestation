#!/usr/bin/env python
import sys

import requests
from flask import Flask, jsonify, make_response

from api.gotoposition import gotoposition
from api.starttasks import start_tasks
from api.feedbacktask import feedback_task
from flask import request

app = Flask(__name__)

app.register_blueprint(gotoposition)
app.register_blueprint(start_tasks)
app.register_blueprint(feedback_task)

PORT = 12345


@app.after_request
def after_request(data):
    response = make_response(data)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers[
        'Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    return response


def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)


@app.route('/obstacles', methods=["GET"])
def get_obstacles():
    obstacles_response = requests.get('http://0.0.0.0:5000/obstacles')
    return make_response(jsonify(obstacles_response.json()))


@app.route('/path', methods=["POST"])
def create_path():
    data = request.json
    requests.post('http://0.0.0.0:5000/path', json=data)
    return make_response(jsonify({"message": "ok"}))


@app.route('/world-dimensions', methods=["GET"])
def get_world_dimensions():
    world_dimensions_response = requests.get('http://0.0.0.0:5000/world-dimensions')
    return make_response(jsonify(world_dimensions_response.json()))


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)


if __name__ == '__main__':
    url = sys.argv[1]
    ROBOT_API_URL = url
    app.run(port=PORT, host='0.0.0.0')
