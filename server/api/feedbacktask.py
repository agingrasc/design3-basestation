from flask import Blueprint, jsonify
from flask import make_response
from flask import request

feedback_task = Blueprint('feedback-task', __name__)

@feedback_task.route("/feedback-task", methods=['POST'])
def feedback_task_():
    data = request.json
    print(data["feedback"])
    return make_response(jsonify({"message": "ok"}))

