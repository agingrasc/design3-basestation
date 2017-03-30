import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080"
ROBOT_VIDEO_SERVICE_URL = "http://192.168.0.27:4040/take-picture"
IMAGE_SEGMENTATION_SERVICE_URL = "http://0.0.0.0:5000/image/segmentation"

start_tasks = Blueprint('start-tasks', __name__)


@start_tasks.route("/start-tasks", methods=['POST'])
def start_tasks_():
    data = request.json

    if is_take_picture_task(data['task_id']):
        if is_fake_segmentation(data):
            body = {"scaling": data['scaling']}
        else:
            robot_response = req.post(url=ROBOT_VIDEO_SERVICE_URL).json()
            robot_response['scaling'] = data['scaling']
            body = robot_response

        image_service_response = req.post(url=build_vision_service_url(is_fake_segmentation(data)), json=body).json()
        robot_configm = req.post(url=ROBOT_API_URL + "/set-image-segments", json=image_service_response).json()
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
    robot_response = req.post(url="http://192.168.0.27:4040" + '/take-picture').json()
    image_service_response = req.post(url=IMAGE_SEGMENTATION_SERVICE_URL, json=robot_response).json()
    send_response = make_response(jsonify(image_service_response))
    return send_response


def build_vision_service_url(fake=False):
    if fake:
        return IMAGE_SEGMENTATION_SERVICE_URL + "?fake=true"
    else:
        return IMAGE_SEGMENTATION_SERVICE_URL


def is_take_picture_task(task_id):
    return task_id == '5' or task_id == 5


def is_fake_segmentation(data):
    return 'fake_segmentation' in data
