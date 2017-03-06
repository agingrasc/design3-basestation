#!/usr/bin/env python
import json
import base64
import cv2
import visionformat
from websocket import create_connection

CONNECTION = create_connection("ws://localhost:3000")

CAM = cv2.VideoCapture(0)
CAM.set(cv2.CAP_PROP_FRAME_HEIGHT, 640)
CAM.set(cv2.CAP_PROP_FRAME_WIDTH, 480)


def build_fake_vision_info():
    ret, frame = CAM.read()
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

    obstacle2 = {}
    obstacle2[visionformat.VISION_OBSTABLE_WIDTH] = "15"
    obstacle2[visionformat.VISION_OBSTACLE_TAG] = "OCPL"

    obstacle2_position = {}
    obstacle2_position[visionformat.VISION_X] = "15"
    obstacle2_position[visionformat.VISION_Y] = "25"

    obstacle2[visionformat.VISION_POSITION] = obstacle2_position

    obstacles.append(obstacle1)
    obstacles.append(obstacle2)

    robot = {}
    robot_position = {}
    robot_position[visionformat.VISION_X] = "35"
    robot_position[visionformat.VISION_Y] = "95"

    robot[visionformat.VISION_POSITION] = robot_position
    robot[visionformat.VISION_ROBOT_ANGLE] = "45"

    data[visionformat.VISION_OBSTABLES] = obstacles
    data[visionformat.VISION_ROBOT] = robot
    data[visionformat.VISION_IMAGE] = image.decode('utf-8')

    value = {}
    value[visionformat.HEADERS] = visionformat.PUSH_VISION_DATA
    value[visionformat.DATA] = data
    CONNECTION.send(json.dumps(value))


while True:
    build_fake_vision_info()
