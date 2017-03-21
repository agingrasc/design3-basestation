from flask import jsonify, make_response, request, Blueprint


end_take_picture_task = Blueprint('end-take-picture-task', __name__)

@end_take_picture_task.route("/end-take-picture-task", methods=['POST'])
def end_take_picture_task_():
    print("ending task taking picture")

    send_response = make_response(jsonify(), 200)
    return send_response