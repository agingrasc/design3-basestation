import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://localhost:5000/go-to-position"

gotoposition = Blueprint('goto_position', __name__)


@gotoposition.route("/go-to-position/", methods=['POST'])
def goto_position():
    pos_x = request.json["x"]
    pos_y = request.json["y"]
    req.post(
        url=ROBOT_API_URL,
        json={"x": pos_x,
              "y": pos_y}, )
    send_response = make_response(jsonify({"x": pos_x, "y": pos_y}), 200)
    return send_response
