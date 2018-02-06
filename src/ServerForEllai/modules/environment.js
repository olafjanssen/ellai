/**
 * Environment model for the AI
 *
 * @author Olaf Janssen <o.t.a.janssen@gmail.com>
 */

const Environment = function () {
    let state = null,
        bodies = [];

    const imageUrls = [
        'https://s-i.huffpost.com/gen/1335607/images/o-MESMERIZING-VIEWS-facebook.jpg',
        'https://thumbs.dreamstime.com/b/mesmerizing-beautiful-eyes-15385134.jpg',
        'https://scontent-ams3-1.xx.fbcdn.net/v/t1.0-9/18301200_1948269545457332_7138887670052306574_n.jpg?oh=b86a9aba5653a4f4814a25974f7d34ab&oe=5B1FEB87',
        'http://images.mentalfloss.com/sites/default/files/styles/mf_image_3x2/public/exploding_watermelon.jpg?itok=-1GaoBNe&resize=1100x740'
    ];

    /**
     * Handle incoming new sensor data.
     * @param {string} type     type of data id
     * @param {object} data     type-specific sensor data
     */
    function newSensorInput(type, data) {
        switch (type) {
            case 'kinect':
                handleKinectInput(data);
                break;
            default:
                break;
        }
    }

    function handleKinectInput(data) {
        // filter out faulty all-zero bodies
        data = data.filter(function (body) {
            return (body.position.x !== 0 && body.position.y !== 0 && body.position.z !== 0);
        });

        // check for body enter and leave
        let stateIds = [];
        data.forEach(function (body) {
            stateIds.push(body.id);
            if (bodies.indexOf(body.id) === -1) {
                bodies.push(body.id);
                // log / broadcast new state
                if (ret.onNewState) {
                    ret.onNewState('body-enters', {id: body.id});
                }
            }
        });

        bodies.forEach(function (body, idx) {
            if (stateIds.indexOf(body) === -1) {
                console.log(bodies, stateIds, body, stateIds.indexOf(body));
                bodies.splice(idx, 1);
                // log / broadcast new state
                if (ret.onNewState) {
                    ret.onNewState('body-leaves', {id: body});
                }

            }
        });

        state.positions = data;
        broadcastState();
    }

    /**
     * Handle a new action input.
     *
     * @param {number} action   the action to take (as index)
     */
    function newAction(action) {
        state.action = action;

        console.log(imageUrls[action % (imageUrls.length)])

        // log / broadcast new state
        if (ret.onNewAction) {
            ret.onNewAction({
                url: imageUrls[action % (imageUrls.length)]
            });
        }
    }

    /**
     * Initialize a new environment.
     *
     * @param {Number} interval     the timestep interval in ms
     */
    function init(interval) {
        // reset environment
        state = {
            tick: 0,
            action: null,
            timestamp: new Date().getTime()
        };
    }

    /**
     * Broadcast state to the world
     */
    function broadcastState() {
        state.tick++;
        state.timestamp = new Date().getTime();

        // log / broadcast new state
        if (ret.onNewState) {
            ret.onNewState('state', state);
        }
    }

    let ret = {
        newSensorInput: newSensorInput,
        newAction: newAction,
        init: init,
        onNewState: null,
        onNewAction: null,
    };

    return ret;
};


module.exports = Environment;