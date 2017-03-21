from flask import jsonify, make_response, request, Blueprint


end_identify_antenna_task = Blueprint('end-identify-antenna-task', __name__)

@end_identify_antenna_task.route("/end-identify-antenna-task", methods=['POST'])
def end_identify_antenna_task_():
    print("ending task identifying antenna")

    send_response = make_response(jsonify(), 200)
    return send_response