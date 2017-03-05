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
    data = {}
    data[visionformat.HEADERS] = visionformat.PUSH_VISION_DATA
    image = base64.b64encode(cnt)
    data[visionformat.DATA] = image.decode('utf-8')
    connection.send(json.dumps(data))


while True:
    allo()
