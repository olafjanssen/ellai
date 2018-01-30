/**
 * Server for testing Kinect output via WebSockets
 *
 * @author Olaf Janssen (olaf.janssen@fontys.nl)
 */

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
      var msg = JSON.parse(message);
      
      if (msg.channel === 'kinectforellai') {
          showKinectMessage(msg.payload);
      }
  });

  ws.on('close', function close() {
    console.log('disconnected');
  });
    
  ws.on('error', () => console.log('errored'));

});


/**
 * Show the actual message payload sent to the kinect channel
 */
function showKinectMessage(payload) {
    console.log(payload);
}
