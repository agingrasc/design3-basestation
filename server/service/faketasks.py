#!/usr/bin/env python
import json

from time import sleep
from websocket import create_connection

from service import visionformat


def fake_tasks():
    connection = create_connection("ws://localhost:3000")

    connection.send(json.dumps({"headers": "reset_tasks"}))

    tasks = {
        visionformat.TASK_INITIAL_ORIENTATION: "False",
        visionformat.TASK_IDENTEFIE_ANTENNA: "False",
        visionformat.TASK_RECEIVE_INFORMATION: "False",
        visionformat.TASK_GO_TO_IMAGE: "False",
        visionformat.TASK_TAKE_PICTURE: "False",
        visionformat.TASK_GO_TO_DRAWING_ZONE: "False",
        visionformat.TASK_DRAW_IMAGE: "False",
        visionformat.TASK_GO_OUT_OF_DRAWING_ZONE: "False",
        visionformat.TASK_LIGHT_RED_LED: "False"
    }

    for task in tasks:
        sleep(2)

        value = {"headers": "push_tasks_information", "data": {"task_name": task}}

        connection.send(json.dumps(value))


fake_tasks()
