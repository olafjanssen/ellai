using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using WebSocketSharp;

namespace KinectForEllai
{
    class WebSocketHandler
    {
        private WebSocket _webSocket;
        private String _channel;
        private readonly JavaScriptSerializer _js = new JavaScriptSerializer();

        public WebSocketHandler(String host, String channel)
        {
            this._channel = channel;
            _webSocket = new WebSocket("ws://" + host);

            Connect();
        }

        public String Send(object obj)
        {
            var message = new { channel = this._channel, payload = obj };

            String data = _js.Serialize(message);
            _webSocket.Send(data);
            return data;
        }

        private void Connect()
        {
            _webSocket.Connect();
        }

    }
}
