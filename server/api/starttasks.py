import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080"

start_tasks = Blueprint('start-tasks', __name__)


@start_tasks.route("/start-tasks", methods=['POST'])
def start_tasks_():
    data = request.json

    print(data)

    if data['task_id'] == '5':
        robot_response = req.post(url=ROBOT_API_URL + '/take-picture').json()
        image_service_response = req.post(url="http://0.0.0.0:5000/image/segmentation", json=robot_response).json()
        send_response = make_response(jsonify(image_service_response))
        return send_response
    else:
        req.post(url=ROBOT_API_URL + '/start-ai', json=data)
        send_response = make_response(jsonify({"message": "ok"}))
        return send_response
