from flask import jsonify, make_response, request, Blueprint


end_go_out_of_drawzone_task = Blueprint('end-go-out-of-drawzone-task', __name__)

@end_go_out_of_drawzone_task.route("/end-go-out-of-drawzone-task", methods=['POST'])
def end_go_out_of_drawzone_task_():
    print("ending task going out of drawzone")

    send_response = make_response(jsonify(), 200)
    return send_response