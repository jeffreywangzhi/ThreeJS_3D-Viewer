// index.js
// var ros = new ROSLIB.Ros();
const ros = new ROSLIB.Ros({
    url: 'ws://192.168.0.131:9090'  // Replace with your ROS server URL 127
});

const listener = new ROSLIB.Topic({
    ros: ros,
    name: '/object3d_detector/poses',
    messageType: 'geometry_msgs/PoseArray'  // Replace with the actual message type
});

listener.subscribe((message) => {
    console.log('Received message:', message);
    // Handle the received data as needed

    // Example: Update HTML element with the received data
    const dataElement = document.getElementById('data-display');
    if (dataElement) {
        dataElement.textContent = message.data;
    }
});