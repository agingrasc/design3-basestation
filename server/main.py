import sys
from flask import Flask, jsonify, make_response
from api.gotoposition import gotoposition

app = Flask(__name__)

app.register_blueprint(gotoposition)

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
