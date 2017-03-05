import base64
import visionformat
import json
from tornado import websocket
import gzip
import tornado.ioloop

GLOBAL = {}
GLOBAL[visionformat.PULL_VISION_DATA] = "heyHo"

REGISTER_VISION_DATA = []


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def initialize(self):
        self.str = " Hello"
        self.vision_data = "damnnnn"
        self.connections = []

    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        value = json.loads(message)
        print(value[visionformat.HEADERS])
        if visionformat.PUSH_VISION_DATA == value[visionformat.HEADERS]:
            GLOBAL[visionformat.PULL_VISION_DATA] = value[visionformat.DATA]
            self.write_message("Ok")
            for connection in REGISTER_VISION_DATA:
                connection.write_message(GLOBAL[visionformat.PULL_VISION_DATA])
        if visionformat.PULL_VISION_DATA == value[visionformat.HEADERS]:
            print("im here")
            self.write_message(GLOBAL[visionformat.PULL_VISION_DATA])
        if visionformat.REGISTER_VISION_DATA == value[visionformat.HEADERS]:
            REGISTER_VISION_DATA.append(self)
            self.write_message(GLOBAL[visionformat.PULL_VISION_DATA])

    def on_close(self):
        print("WebSocket closed")

    def check_origin(self, origin):
        print(origin)
        return True


application = tornado.web.Application([
    (r"/", EchoWebSocket),
])

if __name__ == "__main__":
    application.listen(3000)
    tornado.ioloop.IOLoop.instance().start()
