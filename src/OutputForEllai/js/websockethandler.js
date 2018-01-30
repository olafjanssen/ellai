/**
 * Websocket helper module
 */
var WebsocketHandler = function(host, channel) {
        
        var socket = new WebSocket(host, "protocolOne");
        
        socket.onopen = function(event){
          console.log("WebsocketHandler: Connected");  
        };
        
        socket.onerror = function(event) {
            console.log("WebsocketHandler: ERROR ", event);
        }
        
        socket.onmessage = function(event) {
            var message = JSON.parse(event.data);
            
            if (ret.onMessage){
                ret.onMessage(message.channel, message.payload);
            }
        }
        
        function connect() {
            
        }
        
        function disconnect() {
            socket.close();
        }
        
        function send(payload) {
            var message = {channel: channel, payload: payload};
            socket.send(JSON.stringify(message));
        }
        
        var ret = {
            onMessage: null,
            send: send,
            disconnect: disconnect  
        }
        
        return ret;
    };
    