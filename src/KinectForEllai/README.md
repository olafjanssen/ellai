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
## Dependencies
* [WebSocketSharp](https://github.com/sta/websocket-sharp)
* Kinect SDK 2.0
