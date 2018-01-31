const WebSocket = require('ws');

/**
 * Websocket helper module server side
 */
var WebsocketHandler = function (port) {
    'use strict';

    const wss = new WebSocket.Server({
        port: port
    });

    var sockets = [];

    wss.on('connection', function connection(ws) {
        sockets.push(ws);
        console.log('WebSocketHandler: ' + sockets.length + ' sockets connected');

        ws.on('message', function incoming(message) {
            var msg = JSON.parse(message);

            if (ret.onMessage) {
                ret.onMessage(msg.channel, msg.payload);
            }
        });

        ws.on('close', function close() {
            sockets.splice(sockets.indexOf(ws), 1);
            console.log('WebSocketHandler: socket disconnected');
        });

        ws.on('error', function () {
            console.log('WebSocketHandler: an error occured')
        });
    });

    /**
     * Send an object on the given channel.
     *
     * @param {string} channel  the channel identifying the target audience
     * @param {object} payload  the object to send
     */
    function send(channel, payload) {
        sockets.forEach(function(socket){
            if (socket.readyState === 1) {
                socket.send(JSON.stringify({
                    channel: channel,
                    payload: payload
                }));
            }
        });
    }

    /**
     * Public API
     */
    var ret = {
        onMessage: null,
        send: send
    };

    return ret;
};

module.exports = WebsocketHandler;