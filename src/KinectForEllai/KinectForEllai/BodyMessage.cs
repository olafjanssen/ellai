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
        public ulong id;
        public object position;

        public BodyMessage(ulong id, float posX, float posY, float posZ)
        {
            this.id = id;
            position = new {x = posX, y = posY, z = posZ};
        }
    }
}
