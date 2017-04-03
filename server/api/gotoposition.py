import numpy as np
import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_BASE_URL = "http://192.168.0.27:8080{}"

gotoposition = Blueprint('goto_position', __name__)


def validate_payload(data):
    data['destination']['theta'] = string_deg_to_rad(data['destination']['theta'])
    return data


def string_deg_to_rad(string_deg_angle):
    return str(np.deg2rad(float(string_deg_angle)))


def relay_to_robot(endpoint, payload):
    return req.post(url=ROBOT_API_BASE_URL.format(endpoint), json=payload)


@gotoposition.route("/go-to-position", methods=['POST'])
def goto_position():
    payload = validate_payload(request.json)
    robot_confirm = relay_to_robot("/go-to-position", payload).json()
    send_response = make_response(jsonify(payload), 200)
    return send_response


@gotoposition.route('/go-to-pathfinder', methods=["POST"])
def go_to_pathfinder():
    payload = validate_payload(request.json)
    robot_confirm = relay_to_robot("/go-to-pathfinder", payload).json()
    send_response = make_response(jsonify(payload), 200)
    return send_response
