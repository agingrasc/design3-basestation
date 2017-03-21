from flask import jsonify, make_response, request, Blueprint


end_go_to_image_task = Blueprint('end-go-to-image-task', __name__)

@end_go_to_image_task.route("/end-go-to-image-task", methods=['POST'])
def end_go_to_image_task_():
    print("ending task going to image")

    send_response = make_response(jsonify(), 200)
    return send_response