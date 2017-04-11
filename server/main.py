#!/usr/bin/env python
import sys
from threading import Thread
from time import sleep

import requests
from flask import Flask, jsonify, make_response, json
from websocket import create_connection

from api.gotoposition import gotoposition
from api.starttasks import start_tasks
from api.feedbacktask import feedback_task
from api.visiongateway import vision_gateway

app = Flask(__name__)

app.register_blueprint(gotoposition)
app.register_blueprint(start_tasks)
app.register_blueprint(feedback_task)
app.register_blueprint(vision_gateway)

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


def bad_request():
    return make_response(jsonify({'error': 'Bad Request'}), 400)


@app.errorhandler(404)
def not_found():
    return make_response(jsonify({'error': 'Not Found'}), 404)


def send_heartbeat(robot_url, connection):
    while True:
        sleep(2)

        try:
            response = requests.get(url=robot_url, timeout=0.5).json()
            connection.send(json.dumps({"headers": "robot_online"}))
        except Exception as e:
            connection.send(json.dumps({"headers": "robot_offline"}))


if __name__ == '__main__':
    ROBOT_IP_ADRESS = sys.argv[1]

    connection = create_connection("ws://0.0.0.0:3000/")

    heartbeat_thread = Thread(target=send_heartbeat, args=["http://" + ROBOT_IP_ADRESS + ":8080/hello", connection])
    heartbeat_thread.start()

    app.run(port=PORT, host='0.0.0.0')
