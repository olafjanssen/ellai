using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Microsoft.Kinect;

namespace KinectForEllai
{
    class Program
    {

        public static Body[] Bodies = null;

        // Get defaut KinectSensor (we assume only 1 Kinect is connected)
        private static readonly KinectSensor KinectSensor = KinectSensor.GetDefault();
        
        static void Main(string[] args)
        {
          
            // get the depth (display) extents
            FrameDescription frameDescription = KinectSensor.DepthFrameSource.FrameDescription;

            // get size of joint space
            int displayWidth = frameDescription.Width;
            int displayHeight = frameDescription.Height;

            // open the reader for the body frames
            BodyFrameReader bodyFrameReader = KinectSensor.BodyFrameSource.OpenReader();

            // set the body frame reader event handler
            bodyFrameReader.FrameArrived += Reader_FrameArrived;

            // set IsAvailableChanged event notifier
            KinectSensor.IsAvailableChanged += Sensor_IsAvailableChanged;

            // open the sensor
            KinectSensor.Open();


            Console.ReadKey();
        }

        /// <summary>
        /// Handles the body frame data arriving from the sensor
        /// </summary>
        /// <param name="sender">object sending the event</param>
        /// <param name="e">event arguments</param>
        private static void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            bool dataReceived = false;

            using (BodyFrame bodyFrame = e.FrameReference.AcquireFrame())
            {
                if (bodyFrame != null)
                {
                    if (Bodies == null)
                    {
                        Bodies = new Body[bodyFrame.BodyCount];
                    }

                    // The first time GetAndRefreshBodyData is called, Kinect will allocate each Body in the array.
                    // As long as those body objects are not disposed and not set to null in the array,
                    // those body objects will be re-used.
                    bodyFrame.GetAndRefreshBodyData(Bodies);
                    dataReceived = true;
                }
            }

            if (dataReceived)
            {
                List<BodyMessage> bodyMessages = new List<BodyMessage>();
                
                foreach (Body body in Bodies)
                    {
                        
                        if (body.IsTracked)
                        {

                        CameraSpacePoint headPosition = body.Joints[JointType.Head].Position;

                        if (headPosition.Z < 0)
                        {
                            headPosition.Z = 0.1f;
                        }
                        
                            BodyMessage bodyMessage = new BodyMessage(body.TrackingId, headPosition.X, headPosition.Y, headPosition.Z);
                            bodyMessages.Add(bodyMessage);
                        }
                    }

                if (bodyMessages.Count > 0)
                {
                    JavaScriptSerializer js = new JavaScriptSerializer();
                    Console.WriteLine(js.Serialize(bodyMessages).ToLower());
                }
            }
        }

        /// <summary>
        /// Handles the event which the sensor becomes unavailable (E.g. paused, closed, unplugged).
        /// </summary>
        /// <param name="sender">object sending the event</param>
        /// <param name="e">event arguments</param>
        private static void Sensor_IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            Console.Error.WriteLine(e.IsAvailable ? "Kinect Available" : "Kinect Unavailable");
        }
    }
}
