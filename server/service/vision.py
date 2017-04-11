#!/usr/bin/env python
from datetime import datetime
import json

from tornado import ioloop
from tornado import websocket
from tornado import web

import visionformat

REGISTERED_TO_VISION_DATA = []
REGISTERED_TO_TASK_DATA = []
REGISTERED_TO_IMAGE_SEGMENTATION = []
REGISTERED_TO_ROBOT_ONLINE = []
REGISTERED_TO_ROBOT_FEED = []

ROBOT_POSITION = {}

WORLD_STATE = {
    "pull_vision_data": "",
    "robot_online": False
}


def initialize_task_info():
    return {
        "data": {
            "initial_orientation": "False",
            "identifie_antenna": "False",
            "receive_informations": "False",
            "go_to_image": "False",
            "take_picture": "False",
            "go_to_drawing_zone": "False",
            "draw_image": "False",
            "go_out_of_darwing_zone": "False",
            "light_red_led": "False"
        }
    }


tasks_state = initialize_task_info()


def reset_tasks():
    for key in tasks_state["data"].keys():
        tasks_state["data"][key] = "False"


class VisionWebSocketHandler(websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)

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
            notify_all(REGISTERED_TO_TASK_DATA, tasks_state)

        if message_type == "register_image_segmentation":
            register_to(REGISTERED_TO_IMAGE_SEGMENTATION, self)

        if message_type == "register_to_robot_feed":
            register_to(REGISTERED_TO_ROBOT_FEED, self)

        if message_type == "register_robot_online":
            register_to(REGISTERED_TO_ROBOT_ONLINE, self)
            if WORLD_STATE["robot_online"]:
                notify_all(REGISTERED_TO_ROBOT_ONLINE, {"data": "robot_online"})
            else:
                notify_all(REGISTERED_TO_ROBOT_ONLINE, {"data": "robot_offline"})

        if message_type == "push_vision_data":
            push_vision_data(self, message)

        if message_type == "push_robot_feed":
            notify_all(REGISTERED_TO_ROBOT_FEED, message_data)

        if message_type == "pull_vision_data":
            self.write_message(self._global_state["pull_vision_data"])

        if message_type == "pull_robot_position":
            self.write_message(self._robot_position)

        if message_type == "push_tasks_information":
            push_tasks_information(self, message)

        if message_type == "push_image_segmentation":
            notify_all(REGISTERED_TO_IMAGE_SEGMENTATION, message_data)

        if message_type == "reset_tasks":
            reset_tasks()
            notify_all(REGISTERED_TO_TASK_DATA, tasks_state)

        if message_type == "new_round":
            old_antenna_state = tasks_state["data"]["identifie_antenna"]
            old_orientation_state = tasks_state["data"]["initial_orientation"]

            reset_tasks()

            tasks_state["data"]["identifie_antenna"] = old_antenna_state
            tasks_state["data"]["initial_orientation"] = old_orientation_state

            notify_all(REGISTERED_TO_TASK_DATA, tasks_state)

        if message_type == "robot_online":
            WORLD_STATE["robot_online"] = True
            notify_all(REGISTERED_TO_ROBOT_ONLINE, json.dumps({"data": "robot_online"}))

        if message_type == "robot_offline":
            WORLD_STATE["robot_online"] = False
            notify_all(REGISTERED_TO_ROBOT_ONLINE, json.dumps({"data": "robot_offline"}))

        if message_type == "reset_tasks":
            reset_tasks()
            notify_all(REGISTERED_TO_TASK_DATA, tasks_state)

        if message_type == "cycle_started":
            print(message_data)

        if message_type == "cycle_ended":
            print(message_data)

    def on_close(self):
        unregister(self)
        print("Connection closed: {}".format(datetime.now()))

    def check_origin(self, origin):
        print(origin)
        return True


def update_global_data(message_data):
    WORLD_STATE[visionformat.PULL_VISION_DATA] = message_data


def update_robot_position(message_data):
    ROBOT_POSITION['x'] = message_data["world"]["robot"]["position"]['x']
    ROBOT_POSITION['y'] = message_data["world"]["robot"]["position"]['y']
    ROBOT_POSITION['theta'] = message_data["world"]["robot"]['orientation']


def pull_vision_data(connection):
    message = WORLD_STATE["pull_vision_data"]
    connection.write_message(message)


def push_vision_data(connection, message):
    message_data = message[visionformat.DATA]
    update_global_data(message_data)
    update_robot_position(message_data)
    notify_all(REGISTERED_TO_VISION_DATA, WORLD_STATE[visionformat.PULL_VISION_DATA])


def push_tasks_information(connection, message):
    message_data = message["data"]
    tasks_state["data"][message_data["task_name"]] = "True"
    notify_all(REGISTERED_TO_TASK_DATA, tasks_state)


def notify_all(observers, message):
    for connection in observers:
        connection.write_message(message)


def register_to(registered, connection):
    if connection not in registered:
        registered.append(connection)


def unregister(connection):
    if connection in REGISTERED_TO_VISION_DATA:
        REGISTERED_TO_VISION_DATA.remove(connection)

    if connection in REGISTERED_TO_TASK_DATA:
        REGISTERED_TO_TASK_DATA.remove(connection)

    if connection in REGISTERED_TO_IMAGE_SEGMENTATION:
        REGISTERED_TO_IMAGE_SEGMENTATION.remove(connection)

    if connection in REGISTERED_TO_ROBOT_ONLINE:
        REGISTERED_TO_ROBOT_ONLINE.remove(connection)

    if connection in REGISTERED_TO_ROBOT_FEED:
        REGISTERED_TO_ROBOT_FEED.remove(connection)


class StartTaskRessource(web.RequestHandler):
    def initialize(self, tasks):
        self._tasks = tasks

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
        self.set_header('Content-Type', 'application/json')

    def post(self):
        data = json.loads(self.request.body.decode('utf-8'))

        self.write(json.dumps({"message": "ok"}))


if __name__ == "__main__":
    application = web.Application([
        web.url(r"/", VisionWebSocketHandler, kwargs={'global_state': WORLD_STATE, 'robot_position': ROBOT_POSITION}),
        web.url(r"/start-tasks", StartTaskRessource, kwargs={'tasks': tasks_state})
    ])

    application.listen(3000)

    ioloop.IOLoop.instance().start()
