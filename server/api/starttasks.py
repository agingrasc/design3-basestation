import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080"

start_tasks = Blueprint('start-tasks', __name__)


@start_tasks.route("/start-tasks", methods=['POST'])
def start_tasks_():
    data = request.json

    print(data)

    req.post(url=ROBOT_API_URL + '/start-ai', json=data)
    send_response = make_response(jsonify({"message": "ok"}))
    return send_response
