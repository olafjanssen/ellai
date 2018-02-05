#!/usr/bin/env python
import copy
import websocket
import logging
try:
    import thread
except ImportError:
    import _thread as thread
from collections import deque



class environment_interface:
    states = deque()
    max_length = 100
    logger = logging.getLogger('environment_interface')

    def __init__(self, url):
        def run(*args):
            ws = websocket.WebSocketApp(url)
            ws.on_message = self.on_message
            ws.run_forever()
        thread.start_new_thread(run, ())

    def on_message(self, ws, message):
        self.add_state(message)

    def add_state(self,state):
        # print(state)
        if(len(self.states)<=self.max_length):
            self.states.append(state)
        else:
            self.logger.warning('Buffer exceeds 100 states')

    def get_state(self):
        return self.states.pop()

    def get_latest_states(self):
        temp_states = copy.copy(self.states)
        self.states.clear()
        return temp_states