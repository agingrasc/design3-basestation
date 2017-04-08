import requests

from flask import request
from flask import make_response
from flask import jsonify
from flask import Blueprint

vision_gateway = Blueprint('vision-gateway', __name__)

VISION_SERVICE_BASE_URL = 'http://0.0.0.0:5000'


@vision_gateway.route('/obstacles', methods=["GET"])
def get_obstacles():
    obstacles_response = requests.get(VISION_SERVICE_BASE_URL + '/obstacles')
    return make_response(jsonify(obstacles_response.json()))


@vision_gateway.route('/obstacles/reset', methods=["POST"])
def reset_obstacles():
    reset_obstacles = requests.post(VISION_SERVICE_BASE_URL + '/vision/reset-obstacles')
    return make_response(jsonify(reset_obstacles.json()))


@vision_gateway.route('/world-dimensions', methods=["GET"])
def get_world_dimensions():
    world_dimensions_response = requests.get(VISION_SERVICE_BASE_URL + '/world-dimensions')
    return make_response(jsonify(world_dimensions_response.json()))


@vision_gateway.route('/path', methods=["POST"])
def create_path():
    data = request.json
    requests.post(VISION_SERVICE_BASE_URL + '/path', json=data)
    return make_response(jsonify({"message": "ok"}))
