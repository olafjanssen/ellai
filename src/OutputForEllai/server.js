/**
 * Server for testing Kinect output via WebSockets
 *
 * @author Olaf Janssen (olaf.janssen@fontys.nl)
 */

const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

const sockets = [];

wss.on('connection', function connection(ws) {
    sockets.push(ws);
    console.log(sockets.length + ' connected');
    
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

const imageUrls = [
  'https://s-i.huffpost.com/gen/1335607/images/o-MESMERIZING-VIEWS-facebook.jpg',
    'https://thumbs.dreamstime.com/b/mesmerizing-beautiful-eyes-15385134.jpg',
    'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/18301200_1948269545457332_7138887670052306574_n.jpg?oh=b86a9aba5653a4f4814a25974f7d34ab&oe=5B1FEB87',
    'http://images.mentalfloss.com/sites/default/files/styles/mf_image_3x2/public/exploding_watermelon.jpg?itok=-1GaoBNe&resize=1100x740'
];

/*
setInterval(function () {
    if (socket) {
        console.log(socket.readyState);

        if (socket.readyState === 1) {
            console.log('sending');
            
            var rIdx = Math.round(Math.random()*imageUrls.length);
            
            socket.send(JSON.stringify({
                channel: 'outputforellai',
                payload: {
                    url: imageUrls[rIdx]
                }
            }));
        }
    }
}, 1000);
*/

/**
 * Show the actual message payload sent to the kinect channel
 */
function showKinectMessage(payload) {
    
    const body = payload[0];
    let rId = 0;
    if (body.position.x < 0) {
        if (body.position.y < 0) {
            rId = 0;
        } else {
            rId = 1;
        }
    } else {
        if (body.position.y < 0) {
            rId = 2;
        } else {
            rId = 3;
        }
    }
    
    sockets.forEach(function(socket){ 
        if (socket.readyState === 1) {
            socket.send(JSON.stringify({
                channel: 'outputforellai',
                payload: {
                    url: imageUrls[rId]
                }
            }));
        }
    });
    
}
