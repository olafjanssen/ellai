import tensorflow as tf

from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("/tmp/data/", one_hot=True)

# Parameters
learning_rate = 0.1
num_steps = 500
batch_size = 128
display_step = 100

#Number of neurons per layer
input_neurons = 784
hidden_neurons = 256
output_neurons = 10
hidden_layers = 5


# Inputdata
input_data = tf.placeholder("float", [None, input_neurons])
output_data = tf.placeholder("float", [None, output_neurons])


def create_connections(input_values, neurons_from, neurons_to):
    #Create the inputweights and biases and use them to create connections
    weights = tf.Variable(tf.random_normal([neurons_from, neurons_to]))
    biases = tf.Variable(tf.random_normal([neurons_to]))
    connections = tf.add(tf.matmul(input_values, weights), biases)
    return connections

# Create model
def neural_net(input):
    layers = []
    layers.append(create_connections(input, input_neurons, hidden_neurons))
    for i in range(1, hidden_layers):
        layers.append(create_connections(layers[i - 1], hidden_neurons, hidden_neurons))

    layers.append(create_connections(layers[hidden_layers - 1], hidden_neurons, output_neurons))
    return layers

# Construct model
logits = neural_net(input_data)[hidden_layers]
prediction = tf.nn.softmax(logits)

# Define loss and optimizer
loss_op = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=logits, labels=output_data))
optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate)
train_op = optimizer.minimize(loss_op)

# Evaluate model
correct_pred = tf.equal(tf.argmax(prediction, 1), tf.argmax(output_data, 1))
accuracy = tf.reduce_mean(tf.cast(correct_pred, tf.float32))

# Initialize the variables (i.e. assign their default value)
init = tf.global_variables_initializer()

with tf.Session() as sess:

    # Run the initializer
    sess.run(init)

    for step in range(1, num_steps+1):
        batch_x, batch_y = mnist.train.next_batch(batch_size)
        # Run optimization op (backprop)
        sess.run(train_op, feed_dict={input_data: batch_x, output_data: batch_y})
        if step % display_step == 0 or step == 1:
            # Calculate batch loss and accuracy
            loss, acc = sess.run([loss_op, accuracy], feed_dict={input_data: batch_x,
                                                                 output_data: batch_y})
            print("Step " + str(step) + ", Minibatch Loss= " + \
                  "{:.4f}".format(loss) + ", Training Accuracy= " + \
                  "{:.3f}".format(acc))

    print("Optimization Finished!")

    # Calculate accuracy for MNIST test images
    print("Testing Accuracy:",
          sess.run(accuracy, feed_dict={input_data: mnist.test.images,
                                        output_data: mnist.test.labels}))

