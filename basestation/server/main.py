import requests as req
from flask import Flask, jsonify, make_response, request
app = Flask(__name__)

ROBOT_API_URL = "http://localhost:5000/"
PORT = 12345

@app.after_request
def after_request(data):
    response = make_response(data)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    return response


def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)


@app.route("/go-to-position/", methods=['POST'])
def goto_position():
    print(request.values)
    pos_x = request.json["x"]
    pos_y = request.json["y"]
    print(pos_x)
    print(pos_y)
    response = req.post(url=ROBOT_API_URL + "go-to-position", json={"x" : pos_x, "y": pos_y})
    send_response = make_response(jsonify({"x" : pos_x, "y": pos_y}), 200)
    return send_response

app.run(port=PORT)
