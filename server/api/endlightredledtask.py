from flask import jsonify, make_response, request, Blueprint


end_light_red_led_task = Blueprint('end-light_red_led-task', __name__)

@end_light_red_led_task.route("/end-light_red_led-task", methods=['POST'])
def end_light_red_led_task_():
    print("ending task lighting red led")

    send_response = make_response(jsonify(), 200)
    return send_response