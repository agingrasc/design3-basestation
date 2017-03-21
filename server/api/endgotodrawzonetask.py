from flask import jsonify, make_response, request, Blueprint


end_go_to_drawzone_task = Blueprint('end-go-to-drawzone-task', __name__)

@end_go_to_drawzone_task.route("/end-go-to-drawzone-task", methods=['POST'])
def end_go_to_drawzone_task_():
    print("ending task going to drawzone")

    send_response = make_response(jsonify(), 200)
    return send_response