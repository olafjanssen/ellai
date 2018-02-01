import random
import time
from environment_interface import environment_interface
# === TD(0) ===
# Initialize V(s) arbitrarily, pi to the policy to be evaluated
# Repeat (for each episode)
#   Initialize s
#   a <- action given by pi for s
#   Take action a; observe reward r and next state s'
#   V(s) <- V(s) + alpha[r + gamma V(s') - V(s)]
#   s <- s'
# until s is terminal
epsilon = 0.2


def do_action(action):
    print('Do action: ' + action)


def step(iteration, state):
    action = max_action(state)
    do_action(action)


def epsilon_greedy(state):
    if (random.random < epsilon):
        action = random_action(state)
    else:
        action = max_action(state)
    return action


def random_action(state):
    #
    return 'Random'


def max_action(state):
    #   Do neural net shit and find best action
    return 'Max'


def get_states():
    time.sleep(5)
    for state in environment.get_latest_states():
        # Update the NN with all the states and the calculated value
        # but for now just print
        print(state)

environment = environment_interface('wss://ws.2of1.nl/ellai/')
get_states()
get_states()
