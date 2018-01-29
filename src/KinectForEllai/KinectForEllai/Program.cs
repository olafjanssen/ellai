using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Microsoft.Kinect;
using WebSocketSharp;

namespace KinectForEllai
{
    class Program
    {
        public static WebSocket WebSocket = null;

        // Get defaut KinectSensor (we assume only 1 Kinect is connected)
        private static readonly KinectSensor KinectSensor = KinectSensor.GetDefault();
        
        static void Main(string[] args)
        {
            KinectHandler kinectHandler = new KinectHandler(BodyUpdated);
            
            // TODO the websockets connection is not stable, meaning the program cannot handle a server disconnect well, nor starting up without a running server
            WebSocket = new WebSocket("ws://localhost:8080");
            using (var ws = WebSocket)
            {
                ws.OnMessage += (sender, e) =>
                    Console.WriteLine("Incoming message: " + e.Data);
                ws.Connect();

                Console.ReadKey(true);
            }
        }

        static void BodyUpdated(List<BodyMessage> bodyMessages)
        {
            var message = new { Channel = "KinectForEllai", Payload = bodyMessages };

            JavaScriptSerializer js = new JavaScriptSerializer();
            String data = js.Serialize(message).ToLower();

            Console.WriteLine(data);
            WebSocket.Send(data);
        }


    }
}
