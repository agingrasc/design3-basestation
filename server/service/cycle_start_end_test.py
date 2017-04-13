import json

from time import sleep
from websocket import create_connection

if __name__ == '__main__':
    connection = create_connection('ws://localhost:3000')

    while True:
        connection.send(json.dumps({"headers": "cycle_started"}))
        sleep(3)
        connection.send(json.dumps({"headers": "cycle_ended"}))
        sleep(3)
