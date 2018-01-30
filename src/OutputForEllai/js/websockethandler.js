/**
 * Websocket helper module
 */
var WebsocketHandler = function (host, channel) {
    'use strict';
    
    var socket = null;
    
    /**
     * Connect or reconnect to host
     */
    function connect() {
        socket = new WebSocket(host, "protocolOne");

        /**
         * Log connections
         */
        socket.onopen = function (event) {
            console.log("WebsocketHandler: Connected");
        };

        /**
         * Log errors
         */
        socket.onerror = function (event) {
            console.log("WebsocketHandler: ERROR ", event);
        }
        
        socket.onclose = function(event) {
            console.log("WebsocketHandler: Reconnecting");
            setTimeout(function(){
                connect();
            }, 500);
        }
        
        /**
         * Disect incoming messages into a channel and payload and
         * pass on to the delegate/callback function.
         */
        socket.onmessage = function (event) {
            var message = JSON.parse(event.data);

            if (ret.onMessage) {
                ret.onMessage(message.channel, message.payload);
            }
        }
    }
    
    /**
     * Disconnect a websocket connection
     */
    function disconnect() {
        socket.close();
    }

    /**
     * Send an object on the given channel.
     *
     * @param {object} payload  the object to send
     */
    function send(payload) {
        var message = {
            channel: channel,
            payload: payload
        };
        socket.send(JSON.stringify(message));
    }
    
    /**
     * Public API
     */
    var ret = {
        onMessage: null,
        send: send,
        disconnect: disconnect
    }
    
    connect();
    return ret;
};
