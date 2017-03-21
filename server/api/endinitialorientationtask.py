from flask import jsonify, make_response, request, Blueprint


end_initial_orientation_task = Blueprint('end-initial-orientation-task', __name__)

@end_initial_orientation_task.route("/end-initial-orientation-task", methods=['POST'])
def end_initial_orientation_task_():
    print("ending task initial orientation")

    send_response = make_response(jsonify(), 200)
    return send_response