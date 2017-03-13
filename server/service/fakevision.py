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
    data["image"] = {}
    data["image"]["data"] = image.decode('utf-8')

    data["image"]["original_dimension"] = {}
    data["image"]["original_dimension"]["width"] = "1280"
    data["image"]["original_dimension"]["lenght"] = "800"

    data["image"]["sent_dimension"] = {}
    data["image"]["sent_dimension"]["width"] = "640"
    data["image"]["sent_dimension"]["lenght"] = "400"

    obstacle1 = {}

    obstacle1_position = {}
    obstacle1_position["x"] = "25"
    obstacle1_position["y"] = "65"

    obstacle1_dimension = {}
    obstacle1_dimension["width"] = "10"
    obstacle1_dimension["lenght"] = "10"

    obstacle1["dimension"] = obstacle1_dimension
    obstacle1["position"] = obstacle1_position
    obstacle1["tag"] = "LEFT"

    obstacle2 = {}

    obstacle2_position = {}
    obstacle2_position["x"] = "25"
    obstacle2_position["y"] = "65"

    obstacle2_dimension = {}
    obstacle2_dimension["width"] = "10"
    obstacle2_dimension["lenght"] = "10"

    obstacle2["dimension"] = obstacle2_dimension
    obstacle2["position"] = obstacle2_position
    obstacle2["tag"] = "RIGHT"

    obstacles = []
    obstacles.append(obstacle1)
    obstacles.append(obstacle2)

    robot = {}

    robot_position = {}
    robot_position["x"] = "25"
    robot_position["y"] = "65"

    robot_dimension = {}
    robot_dimension["width"] = "10"
    robot_dimension["lenght"] = "10"

    robot_orientation = {}
    robot_orientation["value"] = "1.2"
    robot_orientation["unit"] = "rad"

    robot["dimension"] = robot_dimension
    robot["position"] = robot_position
    robot["orientation"] = robot_orientation

    base_table = {}
    base_table_dimension = {}

    base_table_dimension["width"] = "90"
    base_table_dimension["lenght"] = "100"

    base_table["dimension"] = base_table_dimension

    world = {}
    world["obstacles"] = obstacles
    world["robot"] = robot
    world["unit"] = "cm"
    world["base_table"] = base_table

    data["world"] = world

    value = {}
    value[visionformat.HEADERS] = "push_vision_data"
    value["data"] = data
    CONNECTION.send(json.dumps(value))


while True:
    build_fake_vision_info()
