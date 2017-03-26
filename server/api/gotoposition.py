import datetime

import numpy as np
import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://192.168.0.27:8080/go-to-position"

gotoposition = Blueprint('goto_position', __name__)


@gotoposition.route("/go-to-position", methods=['POST'])
def goto_position():
    data = request.json

    data['destination']['theta'] = str(np.deg2rad(float(data['destination']['theta'])))
    print(data)

    req.post(url=ROBOT_API_URL, json=data)
    send_response = make_response(jsonify(data), 200)
    send_response.headers['Access-Control-Allow-Origin'] = "*"
    return send_response


@gotoposition.route('/go-to-pathfinder', methods=["POST"])
def go_to_pathfinder():
    data = request.json
    data['destination']['theta'] = str(np.deg2rad(float(data['destination']['theta'])))
    print(data)
    req.post(url="http://192.168.0.27:8080/go-to-pathfinder", json=data)
    send_response = make_response(jsonify(data), 200)
    send_response.headers['Access-Control-Allow-Origin'] = "*"
    return send_response