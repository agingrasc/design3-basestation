import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080/go-to-position"

start_tasks = Blueprint('start-tasks', __name__)

@start_tasks.route("/start-tasks", methods=['POST'])
def start_tasks_():
    data = request.json

    print("starting task " + data["task_id"])

    req.post(url=ROBOT_API_URL, json=data)
    send_response = make_response(jsonify(), 200)
    return send_response