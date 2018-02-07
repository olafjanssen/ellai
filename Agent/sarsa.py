from ..NeuralNet import NeuralNet
import random
from environmentinterface import EnvironmentInterface


class Sarsa:
    # Algorithm parameters: step size α ∈ (0, 1], small ε > 0
    alfa = 0.5
    epsilon = 0.2
    # Initialize Q(s, a), for all s ∈ S+ , a ∈ A(s), arbitrarily except that Q(terminal , ·) = 0
    neuralNet = NeuralNet

    def __init__(self):
        self.environment_interface = EnvironmentInterface('wss://ws.2of1.nl/ellai', self.episode)

    # Loop for each episode:
    def episode(self):
        while self.environment_interface.users_present():
            #   Initialize S
            state = self.environment_interface.get_state()
            #   Choose A from S using policy derived from Q (e.g., ε-greedy)
            posible_actions = self.environment_interface.get_actions()


#   Loop for each step of episode:
#     Take action A, observe R, S′
#     Choose A′ from S′ using policy derived from Q (e.g., ε-greedy)
#     Q(S, A) ← Q(S, A) + α R + γQ(S′, A′) − Q(S, A)
#     S ← S′; A ← A′;
#   until S is terminal

    def epsilon_greedy(self):
        if random.random > self.epsilon:
            self.do_greedy_action()
        else:
            self.do_random_action()


    def do_greedy_action(self):
        print('Do greedy action')

    def do_random_action(self):
        print('Do random action')
