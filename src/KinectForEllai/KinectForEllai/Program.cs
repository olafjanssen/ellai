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

        public static KinectHandler KinectHandler = null; 
        public static WebSocketHandler WebSocketHandler = null;

        static void Main(string[] args)
        {
            KinectHandler = new KinectHandler(BodyUpdated);
            WebSocketHandler = new WebSocketHandler("localhost:8080", "kinectforellai");

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
