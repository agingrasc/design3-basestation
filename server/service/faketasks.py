#!/usr/bin/env python
import json
import visionformat
from websocket import create_connection

CONNECTION = create_connection("ws://localhost:3000")


def fake_tasks():
    data = {}
    data["task_name"] = visionformat.TASK_IDENTEFIE_ANTENNA
    value = {}
    value[visionformat.HEADERS] = "push_tasks_information"
    value["data"] = data
    CONNECTION.send(json.dumps(value))


fake_tasks()
