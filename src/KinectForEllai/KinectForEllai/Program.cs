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
        private static readonly String defaultHost = "localhost:8080";

        public static KinectHandler KinectHandler = null; 
        public static WebSocketHandler WebSocketHandler = null;

        static void Main(string[] args)
        {
            KinectHandler = new KinectHandler(BodyUpdated);

            // use first argument as the server host to connect with
            String host = args.Length == 1 ? args[0] : defaultHost;
            WebSocketHandler = new WebSocketHandler(host, "kinectforellai");
            
            Console.ReadKey(true);
            WebSocketHandler.Disconnect();
        }

        static void BodyUpdated(List<BodyMessage> bodyMessages)
        {
            String data = WebSocketHandler.Send(bodyMessages);
            Console.WriteLine(data);
        }


    }
}
