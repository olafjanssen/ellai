using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;

namespace KinectForEllai
{
    class Program
    {

        private static Body[] bodies = null;

        // Get defaut KinectSensor (we assume only 1 Kinect is connected)
        private static KinectSensor kinectSensor = KinectSensor.GetDefault();

        // get the coordinate mapper
        private static CoordinateMapper coordinateMapper = kinectSensor.CoordinateMapper;

        static void Main(string[] args)
        {
          
            // get the depth (display) extents
            FrameDescription frameDescription = kinectSensor.DepthFrameSource.FrameDescription;

            // get size of joint space
            int displayWidth = frameDescription.Width;
            int displayHeight = frameDescription.Height;

            // open the reader for the body frames
            BodyFrameReader bodyFrameReader = kinectSensor.BodyFrameSource.OpenReader();

            // set the body frame reader event handler
            bodyFrameReader.FrameArrived += Reader_FrameArrived;

            // set IsAvailableChanged event notifier
            kinectSensor.IsAvailableChanged += Sensor_IsAvailableChanged;

            // open the sensor
            kinectSensor.Open();


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
                    if (bodies == null)
                    {
                        bodies = new Body[bodyFrame.BodyCount];
                    }

                    // The first time GetAndRefreshBodyData is called, Kinect will allocate each Body in the array.
                    // As long as those body objects are not disposed and not set to null in the array,
                    // those body objects will be re-used.
                    bodyFrame.GetAndRefreshBodyData(bodies);
                    dataReceived = true;
                }
            }

            if (dataReceived)
            {
                    foreach (Body body in bodies)
                    {
                        
                        if (body.IsTracked)
                        {

                        CameraSpacePoint headPosition = body.Joints[JointType.Head].Position;

                        if (headPosition.Z < 0)
                        {
                            headPosition.Z = 0.1f;
                        }

                        DepthSpacePoint depthSpacePoint = coordinateMapper.MapCameraPointToDepthSpace(headPosition);
                        Console.WriteLine(body.TrackingId + ", " + (int)depthSpacePoint.X + ", " + (int)depthSpacePoint.Y);
                    
                        }
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
