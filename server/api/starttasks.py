import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080"

start_tasks = Blueprint('start-tasks', __name__)


@start_tasks.route("/start-tasks", methods=['POST'])
def start_tasks_():
    data = request.json

    print(data)

    if data['task_id'] == '5':
        if 'fake_segmentation' in data:

            image_service_response = req.post(url="http://0.0.0.0:5000/image/segmentation?fake=true").json()
        else:
            robot_response = req.post(url="http://192.168.0.27:4040" + '/take-picture').json()
            image_service_response = req.post(url="http://0.0.0.0:5000/image/segmentation", json=robot_response).json()

        send_response = make_response(jsonify(image_service_response))
        return send_response
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
    image_service_response = req.post(url="http://0.0.0.0:5000/image/segmentation", json=robot_response).json()
    send_response = make_response(jsonify(image_service_response))
    return send_response
