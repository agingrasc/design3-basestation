import json

import requests as req

from flask import jsonify
from flask import make_response
from flask import request
from flask import Blueprint

from websocket import create_connection

ROBOT_API_URL = "http://192.168.0.27:8080"
ROBOT_VIDEO_SERVICE_URL = "http://192.168.0.27:4040/take-picture"
IMAGE_SEGMENTATION_SERVICE_URL = "http://0.0.0.0:5000/image/segmentation"
BASE_STATION_URL = "192.168.0.25"

start_tasks = Blueprint('start-tasks', __name__)


@start_tasks.route("/start-tasks", methods=['POST'])
def send_task():
    send_own_url()

    data = request.json

    if is_take_picture_task(data['task_id']):
        if is_fake_segmentation(data):
            body = {"scaling": data['scaling'], "orientation": data['orientation']}
        else:
            robot_response = req.post(url=ROBOT_VIDEO_SERVICE_URL).json()
            robot_response['scaling'] = data['scaling']
            robot_response['orientation'] = data['orientation']
            body = robot_response
            green_led_response = req.post(url=ROBOT_API_URL + '/light-green-led').json()

        image_service_response = req.post(url=build_vision_service_url(is_fake_segmentation(data)), json=body).json()
        robot_confirm = req.post(url=ROBOT_API_URL + "/set-image-segments", json=image_service_response).json()
        return make_response(jsonify(image_service_response))
    else:
        try:
            req.post(url=ROBOT_API_URL + '/start-ai', json=data)
            message = {"message": "ok"}
        except ConnectionRefusedError:
            message = {"error": "robot not responding"}
        send_response = make_response(jsonify(message))
        return send_response


@start_tasks.route('/take-picture', methods=['POST'])
def take_picture():
    data = request.json
    robot_response = req.post(url=ROBOT_VIDEO_SERVICE_URL).json()
    robot_response['scaling'] = data['data']['scaling']
    robot_response['orientation'] = data['data']['orientation']
    body = robot_response
    green_led_response = req.post(url=ROBOT_API_URL + '/light-green-led').json()
    image_service_response = req.post(url=build_vision_service_url(is_fake_segmentation(data)), json=body).json()
    robot_confirm = req.post(url=ROBOT_API_URL + "/set-image-segments", json=image_service_response).json()
    connection = create_connection("ws://localhost:3000")
    connection.send(json.dumps({"headers": "push_image_segmentation", "data": image_service_response}))
    return make_response(jsonify(image_service_response))


def send_own_url():
    return req.post(url=ROBOT_API_URL + "/set-url",
                    json={"data": {"base_station_url": BASE_STATION_URL}}).json()


def build_vision_service_url(fake=False):
    if fake:
        return IMAGE_SEGMENTATION_SERVICE_URL + "?fake=true"
    else:
        return IMAGE_SEGMENTATION_SERVICE_URL


def is_take_picture_task(task_id):
    return task_id == '5' or task_id == 5


def is_fake_segmentation(data):
    return 'fake_segmentation' in data
