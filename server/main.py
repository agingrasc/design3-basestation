#!/usr/bin/env python
import sys
from flask import Flask, jsonify, make_response
from api.gotoposition import gotoposition

from server.api.enddrawtask import end_draw_task
from server.api.endgooutofdrawzonetask import end_go_out_of_drawzone_task
from server.api.endgotodrawzonetask import end_go_to_drawzone_task
from server.api.endgotoimagetask import end_go_to_image_task
from server.api.endidentifyantennatask import end_identify_antenna_task
from server.api.endinitialorientationtask import end_initial_orientation_task
from server.api.endlightredledtask import end_light_red_led_task
from server.api.endreceiveinformationtask import end_receive_information_task
from server.api.endtakepicturetask import end_take_picture_task

app = Flask(__name__)

app.register_blueprint(gotoposition)
app.register_blueprint(end_initial_orientation_task)
app.register_blueprint(end_receive_information_task)
app.register_blueprint(end_take_picture_task)
app.register_blueprint(end_go_to_image_task)
app.register_blueprint(end_go_to_drawzone_task)
app.register_blueprint(end_draw_task)
app.register_blueprint(end_go_out_of_drawzone_task)
app.register_blueprint(end_light_red_led_task)
app.register_blueprint(end_identify_antenna_task)

PORT = 12345

@app.after_request
def after_request(data):
    response = make_response(data)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers[
        'Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    return response

def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)

if __name__ == '__main__':
    url = sys.argv[1]
    ROBOT_API_URL = url
    app.run(port=PORT, host='0.0.0.0')
