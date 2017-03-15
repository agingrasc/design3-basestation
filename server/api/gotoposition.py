import requests as req
from flask import jsonify, make_response, request, Blueprint

ROBOT_API_URL = "http://localhost:5000/go-to-position"

gotoposition = Blueprint('goto_position', __name__)


@gotoposition.route("/go-to-position/", methods=['POST'])
def goto_position():
    req.post(url=ROBOT_API_URL, json=request.json)
    send_response = make_response(jsonify(request.json), 200)
    return send_response
