#!/usr/bin/env python
from datetime import datetime
import json
import visionformat
from tornado import ioloop
from tornado import websocket
from tornado import web

REGISTERED_TO_VISION_DATA = []
REGISTERED_TO_TASK_DATA = []

ROBOT_POSITION = {}

GLOBAL = {
    visionformat.PULL_VISION_DATA: ""
}


def initialize_task_info():
    return {
        "data": {
            visionformat.TASK_DRAW_IMAGE: "False",
            visionformat.TASK_GO_OUT_OF_DRAWING_ZONE: "False",
            visionformat.TASK_GO_TO_DRAWING_ZONE: "False",
            visionformat.TASK_GO_TO_IMAGE: "False",
            visionformat.TASK_IDENTEFIE_ANTENNA: "False",
            visionformat.TASK_RECEIVE_INFORMATION: "False",
            visionformat.TASK_TAKE_PICTURE: "False",
            visionformat.TASK_INITIAL_ORIENTATION: "False",
            visionformat.TASK_LIGHT_RED_LED: "False"
        }
    }


tasks_state = initialize_task_info()


class VisionWebSocketHandler(websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)
        self._global_state = None
        self._robot_position = None

    def initialize(self, global_state, robot_position):
        self._global_state = global_state
        self._robot_position = robot_position
        print("{} initialized: {}\n".format(type(self).__name__, datetime.now()))

    def open(self):
        print("New connection opened: {}".format(datetime.now()))

    def on_message(self, message_data):
        message = json.loads(message_data)
        message_type = message["headers"]

        print("{} -- {}".format(message_type.upper(), datetime.now()))

        if message_type == "register_vision_data":
            register_to(REGISTERED_TO_VISION_DATA, self)

        if message_type == "register_task_data":
            register_to(REGISTERED_TO_TASK_DATA, self)

        if message_type == "push_vision_data":
            push_vision_data(self, message)

        if message_type == "pull_vision_data":
            self.write_message(self._global_state["pull_vision_data"])

        if message_type == "pull_robot_position":
            self.write_message(self._robot_position)

        if message_type == "push_tasks_information":
            push_tasks_information(self, message)

        if message_type == "new_round":
            initialize_task_info()

            tasks_state["data"][visionformat.TASK_IDENTEFIE_ANTENNA] = "True"
            tasks_state["data"][visionformat.TASK_INITIAL_ORIENTATION] = "True"

            notify_all(REGISTERED_TO_TASK_DATA, tasks_state)

    def on_close(self):
        if self in REGISTERED_TO_VISION_DATA:
            REGISTERED_TO_VISION_DATA.remove(self)

        if self in REGISTERED_TO_TASK_DATA:
            REGISTERED_TO_TASK_DATA.remove(self)

        print("Connection closed: {}\n".format(datetime.now()))

    def check_origin(self, origin):
        print(origin)
        return True


def update_global_data(message_data):
    GLOBAL[visionformat.PULL_VISION_DATA] = message_data


def update_robot_position(message_data):
    ROBOT_POSITION['x'] = message_data["world"]["robot"]["position"]['x']
    ROBOT_POSITION['y'] = message_data["world"]["robot"]["position"]['y']
    ROBOT_POSITION['theta'] = message_data["world"]["robot"]['orientation']


def pull_vision_data(connection):
    message = GLOBAL[visionformat.PULL_VISION_DATA]
    connection.write_message(message)


def push_vision_data(connection, message):
    message_data = message[visionformat.DATA]
    update_global_data(message_data)
    update_robot_position(message_data)
    connection.write_message("Ok")
    notify_all(REGISTERED_TO_VISION_DATA, GLOBAL[visionformat.PULL_VISION_DATA])


def push_tasks_information(connection, message):
    message_data = message["data"]

    tasks_state["data"][message_data["task_name"]] = "True"

    connection.write_message("Ok")

    notify_all(REGISTERED_TO_TASK_DATA, tasks_state)


def notify_all(observers, message):
    for connection in observers:
        connection.write_message(message)


def register_to(registered, connection):
    if connection not in registered:
        registered.append(connection)


application = web.Application([
    web.url(r"/", VisionWebSocketHandler, kwargs={'global_state': GLOBAL, 'robot_position': ROBOT_POSITION})
])

if __name__ == "__main__":
    application.listen(3000)
    ioloop.IOLoop.instance().start()
