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
            environment.newAction(payload);
            break;
    }
};

environment.init(100);

environment.onNewState = function (state) {
    logger.log(state);
    webSocketHandler.send('state', state);
};

environment.onNewAction = function(action){
    webSocketHandler.send('outputforellai', action);
};
