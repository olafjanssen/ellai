using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace KinectForEllai
{
    class KinectHandler
    {
        // Get defaut KinectSensor (we assume only 1 Kinect is connected)
        private static readonly KinectSensor KinectSensor = KinectSensor.GetDefault();

        public static Body[] Bodies = null;

        private Action<List<BodyMessage>> BodyUpdated;

        public KinectHandler(Action<List<BodyMessage>> bodyUpdated)
        {
            // set the data callback method
            this.BodyUpdated = bodyUpdated;

            // set IsAvailableChanged event notifier
            KinectSensor.IsAvailableChanged += IsAvailableChanged;

            // open the reader for the body frames
            BodyFrameReader bodyFrameReader = KinectSensor.BodyFrameSource.OpenReader();

            // set the body frame reader event handler
            bodyFrameReader.FrameArrived += FrameArrived;

            // open the sensor
            KinectSensor.Open();
        }

        /// <summary>
        /// Handles the event which the sensor becomes unavailable (E.g. paused, closed, unplugged).
        /// </summary>
        /// <param name="sender">object sending the event</param>
        /// <param name="e">event arguments</param>
        private void IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            Console.Error.WriteLine(e.IsAvailable ? "Kinect Available" : "Kinect Unavailable");
        }

        /// <summary>
        /// Handles the body frame data arriving from the sensor
        /// </summary>
        /// <param name="sender">object sending the event</param>
        /// <param name="e">event arguments</param>
        private void FrameArrived(object sender, BodyFrameArrivedEventArgs e)
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
                    BodyUpdated(bodyMessages);
                }
            }
        }
    }
}
