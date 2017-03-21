from flask import jsonify, make_response, request, Blueprint


end_receive_information_task = Blueprint('end-receive-information-task', __name__)

@end_receive_information_task.route("/end-receive-information-task", methods=['POST'])
def end_receive_information_task_():
    print("ending task receiving informations")

    send_response = make_response(jsonify(), 200)
    return send_response