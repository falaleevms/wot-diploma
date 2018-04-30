var awsIot = require('aws-iot-device-sdk');
var interval;

var device = awsIot.device({
   keyPath: "bad49135a9-private.pem.key",
  certPath: "bad49135a9-certificate.pem.crt",
    caPath: "root-CA.pem",
  clientId: "pressure-sensor",
      host: "a16l44ajg5k2yc.iot.us-east-2.amazonaws.com"
});

// Device is an instance returned by mqtt.Client()
device
  .on('connect', function() {
    console.log('Device connected to AWS');
    interval = setInterval(updateValue, 5000);
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });


function updateValue() {
  device.publish('Test-policy', JSON.stringify({ value: getRandomArbitrary(0, 15)}));
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

process.on('SIGINT', function() {
 clearInterval(interval);
 device.end();
 process.exit();
});
