#!/usr/bin/env python
import copy
import threading
import websocket
import logging
import json
try:
    import thread
except ImportError:
    import _thread as thread
from collections import deque


class EnvironmentInterface:
    states = deque()
    users = {}
    max_length = 1000
    logger = logging.getLogger('EnvironmentInterface')
    lock = threading.Lock()
    numberOfUsers = 0

    def __init__(self, url, start_callback):
        self.start_callback = start_callback

        def run():
            ws = websocket.WebSocketApp(url)
            ws.on_message = self.on_message
            ws.run_forever()
        thread.start_new_thread(run, ())

    @staticmethod
    def decode_message(message_text):
        message = json.loads(message_text)
        channel = message['channel']
        payload = message['payload']
        return channel, payload

    def on_message(self, ws, message):
        channel, payload = self.decode_message(message)
        if channel == 'state':
            if len(self.states) <= self.max_length:
                self.states.append(payload)
            else:
                self.logger.warning('Buffer exceeds 100 states')
        elif channel == 'body-enters':
            self.user_entered()
        elif channel == 'body-leaves':
            self.user_leaved()

    def get_state(self):
        return self.states.pop()

    def get_latest_states(self):
        temp_states = copy.copy(self.states)
        self.states.clear()
        return temp_states

    def users_present(self):
        return self.numberOfUsers > 0

    def user_entered(self):
        if self.numberOfUsers == 0:
            self.start_callback()
        self.numberOfUsers += 1

    def user_leaved(self):
        self.numberOfUsers -= 1

    def get_actions(self):
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
