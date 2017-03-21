from flask import jsonify, make_response, request, Blueprint


end_draw_task = Blueprint('end-draw-task', __name__)

@end_draw_task.route("/end-draw-task", methods=['POST'])
def end_draw_task_():
    print("ending task drawing")

    send_response = make_response(jsonify(), 200)
    return send_response