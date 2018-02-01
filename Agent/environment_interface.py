#!/usr/bin/env python
import copy
import websocket
try:
    import thread
except ImportError:
    import _thread as thread
from collections import deque
states = deque()
max_length = 100

class environment_interface:
    def __init__(self, url):
        def run(*args):
            ws = websocket.WebSocketApp(url)
            ws.on_message = environment_interface.on_message
            ws.run_forever()
        thread.start_new_thread(run, ())

    def on_message(ws, message):
        environment_interface.add_state(environment_interface, message)

    def add_state(self,state):
        # print(state)
        if(len(states)<=max_length):
            states.append(state)
        else:
            print("Buffer exceeds 100 states")

    def get_state(self):
        return states.pop()

    def get_latest_states(self):
        temp_states = copy.copy(states)
        states.clear()
        return temp_states