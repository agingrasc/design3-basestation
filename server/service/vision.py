import base64
import visionformat
import json
from tornado import websocket
import gzip
import tornado.ioloop

GLOBAL = {}
GLOBAL[visionformat.PULL_VISION_DATA] = "heyHo"


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def initialize(self):
        self.str = " Hello"
        self.vision_data = "damnnnn"
        self.connections = []

    def open(self):
        print("WebSocket opened")
        self.write_message(self.str)

    def on_message(self, message):
        value = json.loads(message)
        print(value[visionformat.HEADERS])
        if visionformat.PUSH_VISION_DATA == value[visionformat.HEADERS]:
            GLOBAL[visionformat.PULL_VISION_DATA] = value[visionformat.DATA]
            self.write_message("Ok")
        if visionformat.PULL_VISION_DATA == value[visionformat.HEADERS]:
            print("im here")
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
