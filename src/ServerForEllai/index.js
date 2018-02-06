/**
 * Server for Ellai
 *
 * @author Olaf Janssen (olaf.janssen@fontys.nl)
 */

const WebSocketHandler = require('./modules/websockethandler');
const Environment = require('./modules/environment');
const Logger = require('./modules/logger');

const webSocketHandler = new WebSocketHandler(8080),
    environment = new Environment(),
    logger = new Logger('./log');

webSocketHandler.onMessage = function (channel, payload) {
    switch (channel) {
        case 'kinectforellai':
            environment.newSensorInput('kinect', payload);
            break;
        case 'action':
            environment.newAction(payload.action);
            break;
    }
};

environment.init(100);

environment.onNewState = function (type, state) {
    logger.log({channel: type, payload: state});
    webSocketHandler.send(type, state);
};

environment.onNewAction = function (action) {
    console.log('PAYLOAD', action);
    webSocketHandler.send('outputforellai', action);
};
