/**
 * Mocks a Kinect sensor for output with two brownian motion bodies
 */
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080', function (error) {
    console.log(error);
});

ws.on('open', function open() {
    console.log('Connected');

    let bodies = [{id: '1', position: {x: -2, y: 0, z: 0}},
        {id: '2', position: {x: 0, y: -2, z: 0}}];


    setInterval(function () {
        // update bodies
        let state = [];

        bodies.forEach(function (body) {
            body.position.x += Math.random() * 0.1 - 0.05;
            body.position.y += Math.random() * 0.1 - 0.05;
            body.position.z += Math.random() * 0.1 - 0.05;

            body.position.x = Math.max(-2, Math.min(body.position.x, 2));
            body.position.y = Math.max(-2, Math.min(body.position.x, 2));
            body.position.z = Math.max(-2, Math.min(body.position.x, 2));

            if (body.position.x > -1 && body.position.x < 1 && body.position.y > -1 && body.position.y < 1 && body.position.z > -1 && body.position.z < 1) {
                state.push(body);
            }
        });

        if (state.length>0) {
            console.log(state);
            ws.send(JSON.stringify({channel: 'kinectforellai', payload: state}));
        }
    }, 10);
});

