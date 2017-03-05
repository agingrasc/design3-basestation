import base64
import json
import cv2
import visionformat
from websocket import create_connection

connection = create_connection("ws://localhost:3000")

cam = cv2.VideoCapture(0)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 640)
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 480)


def allo():
    ret, frame = cam.read()
    if not ret:
        print("ERROR")
    cnt = cv2.imencode('.png', frame)[1]
    image = base64.b64encode(cnt)

    data = {}
    data[visionformat.VISION_IMAGE] = image.decode('utf-8')

    obstacles = []

    obstacle1 = {}
    obstacle1[visionformat.VISION_OBSTABLE_WIDTH] = "15"
    obstacle1[visionformat.VISION_OBSTACLE_TAG] = "OCPR"

    obstacle1_position = {}
    obstacle1_position[visionformat.VISION_X] = "25"
    obstacle1_position[visionformat.VISION_Y] = "65"

    obstacle1[visionformat.VISION_POSITION] = obstacle1_position

    obstacles.append(obstacle1)

    data[visionformat.VISION_OBSTABLES] = obstacles
    data[visionformat.VISION_IMAGE] = image.decode('utf-8')

    value = {}
    value[visionformat.HEADERS] = visionformat.PUSH_VISION_DATA
    value[visionformat.DATA] = data
    connection.send(json.dumps(value))


while True:
    allo()
