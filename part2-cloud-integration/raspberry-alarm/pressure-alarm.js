const Gpio = require('onoff').Gpio;
var awsIot = require('aws-iot-device-sdk');

var buzzer = new Gpio(22, 'out');

var device = awsIot.device({
   keyPath: "157f8a92c7-private.pem.key",
  certPath: "157f8a92c7-certificate.pem.crt",
    caPath: "root-CA.pem",
  clientId: "RaspberryPi",
      host: "a16l44ajg5k2yc.iot.us-east-2.amazonaws.com"
});

device
  .on('connect', function() {
    console.log('Device connected to AWS');
    device.subscribe('pressure-senor-Policy');
  });

device
  .on('message', function(topic, payload) {
    var msg = JSON.parse(payload.toString())
    console.log('message', topic, msg);
    if (msg.value > 10) {
        buzzer.write(1, function(){ console.log('Pressure more than 10: alarm')});
    }
    else {
        buzzer.write(0, function(){ console.log('Normal pressure')})
    }
  });
