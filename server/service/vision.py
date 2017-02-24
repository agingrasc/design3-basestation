import base64
from tornado import websocket
import tornado.ioloop
class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def initialize(self):
        imageFile = open("test.png", "rb")
        self.str = base64.b64encode(imageFile.read())

    def open(self):
        print("WebSocket opened")
        self.write_message(self.str)

    def on_message(self, message):
        self.write_message(self.str)

    def on_close(self):
        print("WebSocket closed")

    def check_origin(self, origin):
        print(origin)
        return True


application = tornado.web.Application([(r"/", EchoWebSocket),])

if __name__ == "__main__":
    application.listen(3000)
    tornado.ioloop.IOLoop.instance().start()
