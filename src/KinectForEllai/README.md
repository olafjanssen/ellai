# KinectForEllai

KinectForEllai is a lightweight console application written in C#. It detects the head position of all bodies and returns the data as a JSON array to the standard output.

In addition it will try to send the data over WebSockets.

## Transmitted data
The data will have the following format (using an example):

```json
{
    "channel": "kinnectforellai", 
    "payload": [{"id": "bodyId1", "position": {"x": 0, "y": 0, "z": 0}},
                {"id": "bodyId2", "position": {"x": 0, "y": 0, "z": 0}}]
}
```

## Testing and running
Build and run the console app. The first argument is the WebSockets host.

```bash
 KinectForEllai.exe localhost:8080
```

To test the communication you can use the node server in the folder 'SocketTestServer', first install the dependencies:

```bash
  npm install
```

Then run the server that will echo the KinectForEllai messages:

```bash
  node index.js
```


## Dependencies
* [WebSocketSharp](https://github.com/sta/websocket-sharp)
* Kinect SDK 2.0
