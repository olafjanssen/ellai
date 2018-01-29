using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace KinectForEllai
{
    /// <summary>
    /// Stores the data for a single body that will serve as the output.
    /// </summary>
    class BodyMessage
    {
        public ulong Id;
        public Vector3 Position;

        public BodyMessage(ulong id, float posX, float posY, float posZ)
        {
            this.Id = id;
            Position = new Vector3(posX, posY, posZ);
        }
    }
}
