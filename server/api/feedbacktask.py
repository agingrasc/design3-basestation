import json

from flask import Blueprint, jsonify
from flask import make_response
from flask import request
from websocket import create_connection

feedback_task = Blueprint('feedback-task', __name__)


@feedback_task.route("/feedback-task", methods=['POST'])
def feedback_task_():
    data = request.json

    connection = create_connection("ws://localhost:3000")
    connection.send(json.dumps({"headers": "feedback_receive", "data": data['feedback']}))

    return make_response(jsonify({"message": "ok"}))
