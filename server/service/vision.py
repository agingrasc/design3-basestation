#!/usr/bin/env python
from datetime import datetime
import json
import visionformat
from tornado import ioloop
from tornado import websocket
from tornado import web

GLOBAL = {}
GLOBAL[visionformat.PULL_VISION_DATA] = ""
REGISTERS_TO_VISION_DATA = []

ROBOT_POSITION = {}


class VisionWebSocketHandler(websocket.WebSocketHandler):
    def initialize(self):
        self.vision_data = ""
        self.connections = []
        print("{} initialized: {}\n".format(type(self).__name__, datetime.now()))

    def open(self):
        print("New connection opened: {}\n".format(datetime.now()))

    def on_message(self, message_data):
        message = json.loads(message_data)
        print("{} message receive: {}".format(message[visionformat.HEADERS].upper(), datetime.now()))

        if visionformat.PUSH_VISION_DATA == message[visionformat.HEADERS]:
            push_vision_data(self, message)
        if visionformat.PULL_VISION_DATA == message[visionformat.HEADERS]:
            pull_vision_data(self)
        if visionformat.REGISTER_VISION_DATA == message[visionformat.HEADERS]:
            register_vision_data(self)
        if message[visionformat.HEADERS] == "pull_robot_position":
            print("Asking robot position")
            print(ROBOT_POSITION)
            self.write_message(ROBOT_POSITION)

    def on_close(self):
        if any(self == connection for connection in REGISTERS_TO_VISION_DATA):
            REGISTERS_TO_VISION_DATA.remove(self)
        print("Connection closed: {}\n".format(datetime.now()))

    def check_origin(self, origin):
        print(origin)
        return True


def update_robot_position(message_data):
    ROBOT_POSITION['x'] = message_data["world"]["robot"]["position"]['x']
    ROBOT_POSITION['y'] = message_data["world"]["robot"]["position"]['y']
    ROBOT_POSITION['theta'] = message_data["world"]["robot"]['orientation']


def update_global_data(message_data):
    GLOBAL[visionformat.PULL_VISION_DATA] = message_data


def send_data_to_registered():
    for connection in REGISTERS_TO_VISION_DATA:
        connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


def push_vision_data(connection, message):
    message_data = message[visionformat.DATA]
    update_global_data(message_data)
    update_robot_position(message_data)
    connection.write_message("Ok")
    send_data_to_registered()


def pull_vision_data(connection):
    connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


def register_vision_data(connection):
    REGISTERS_TO_VISION_DATA.append(connection)
    connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


APPLICATION = web.Application([
    (r"/", VisionWebSocketHandler),
])

if __name__ == "__main__":
    APPLICATION.listen(3000)
    ioloop.IOLoop.instance().start()
