/**
 * Mocks the actual AI agent using a simple JavaScript RL implementation
 *
 * @constructor
 */
const RL = require('./rl.js');

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080', function (error) {
    console.log(error);
});

ws.on('open', function open() {
    console.log('Connected');
});

ws.on('message', function incoming(message) {
    let msg = JSON.parse(message);

    if (msg.channel === 'state') {
        console.log(state);
        update(msg.payload);
    }
});


// brain specs
let spec = {}
spec.update = 'qlearn'; // qlearn | sarsa
spec.gamma = 0.9; // discount factor, [0, 1)
spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
spec.alpha = 0.005; // value function learning rate
spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
spec.experience_size = 10000; // size of experience
spec.learning_steps_per_iteration = 5;
spec.tderror_clamp = 1.0; // for robustness
spec.num_hidden_units = 100; // number of neurons in hidden layer

let env = {
    getNumStates: function(){ return 7; },
    getMaxNumActions: function() { return 6; }
};

let num_actions = 6;

let brain = new RL.DQNAgent(env, spec); // give agent a TD brain
// current output on world
let action = brain.act(Array.apply(null, Array(env.getNumStates())).map(Number.prototype.valueOf,0));

let reward = 0.0;

// last state of the world
let state = {};

/**
 * Update the Agent in the given environment context.
 *
 * This means updating the input nodes of the neural network, activating the network and turn the output of
 * the network into action
 *
 * @param state     The environment state
 */
function update(state) {
    if (!state.positions) {
        return;
    }
    console.log('Received state:', state);

    // get reward from state
    reward = state.positions.length;

    // train brain based on the reward from the new state
    brain.learn(reward);

    // reset  reward
    reward = 0;

    // translate state to brain input
    let input_array = [
        0, 0, 0, 0, 0, 0, 0
    ];

    state.positions.forEach(function (body, index) {
        input_array[index * 3] = body.position.x;
        input_array[index * 3 + 1] = body.position.y;
        input_array[index * 3 + 2] = body.position.z;
    });

    input_array[6] = state.action ? state.action.action : 0;

    console.log(input_array);

    // activate the neural network and obtain a new action
    action = brain.act(input_array);

    // communicate action back to environment
    console.log('Returning action:', action);
    ws.send(JSON.stringify({channel:'action', payload: {action: action}}));
}
