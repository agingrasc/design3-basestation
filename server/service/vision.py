#!/usr/bin/env python
import json
import visionformat
from tornado import ioloop
from tornado import websocket
from tornado import web

GLOBAL = {}
GLOBAL[visionformat.PULL_VISION_DATA] = ""
REGISTERS_TO_VISION_DATA = []

ROBOT_POSITION = {}


class EchoWebSocket(websocket.WebSocketHandler):
    def initialize(self):
        self.vision_data = ""
        self.connections = []

    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        value = json.loads(message)
        print(value[visionformat.HEADERS])
        if visionformat.PUSH_VISION_DATA == value[visionformat.HEADERS]:
            push_vision_data(self, value)
        if visionformat.PULL_VISION_DATA == value[visionformat.HEADERS]:
            pull_vision_data(self)
        if visionformat.REGISTER_VISION_DATA == value[visionformat.HEADERS]:
            register_vision_data(self)
        if value[visionformat.HEADERS] == "pull_robot_position":
            self.write_message(ROBOT_POSITION)

    def on_close(self):
        if any(self == connection for connection in REGISTERS_TO_VISION_DATA):
            REGISTERS_TO_VISION_DATA.remove(self)
        print("WebSocket closed")

    def check_origin(self, origin):
        print(origin)
        return True


def push_vision_data(connection, value):
    GLOBAL[visionformat.PULL_VISION_DATA] = value[visionformat.DATA]
    ROBOT_POSITION = value["data"]["world"]["robot"]["position"]
    connection.write_message("Ok")
    for connection in REGISTERS_TO_VISION_DATA:
        connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


def pull_vision_data(connection):
    connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


def register_vision_data(connection):
    REGISTERS_TO_VISION_DATA.append(connection)
    connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])


APPLICATION = web.Application([
    (r"/", EchoWebSocket),
])

if __name__ == "__main__":
    APPLICATION.listen(3000)
    ioloop.IOLoop.instance().start()
