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
        private readonly WebSocket _webSocket;

        private readonly String _channel;

        private readonly JavaScriptSerializer _js = new JavaScriptSerializer();

        public WebSocketHandler(String host, String channel)
        {
            this._channel = channel;
            _webSocket = new WebSocket("ws://" + host);

            _webSocket.OnError += (sender, e) => {
               Console.Error.WriteLine("WebSocketHandler: " + e.Message);
            };

            _webSocket.OnClose += (sender, e) => {
               Console.Error.WriteLine("WebSocketHandler: " + e.Reason); 
            };

            Connect();
        }

        public String Send(object obj)
        {
            var message = new { channel = this._channel, payload = obj };
            String data = _js.Serialize(message);

            if (_webSocket.IsAlive)
            {
                _webSocket.Send(data);
            }
            else
            {
                Connect();
            }

            return data;
        }

        public void Disconnect()
        {
            _webSocket.Close();
        }

        private void Connect()
        {
            _webSocket.Connect();
        }

    }
}
