var resources = require('./../../resources/model');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Temperature & Humidity';
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
    localParams = params;
    if (localParams.simulate) {
        simulate();
    } else {
        connectHardware();
    }
};

exports.stop = function () {
 if (localParams.simulate) {
 clearInterval(interval);
 } else {
 sensor.unexport();
 }
 console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
    var sensorDriver = require('node-dht-sensor');
    var sensor = {
        initialize: function () {
            return sensorDriver.initialize(11, model.temperature.gpio);
        },
        read: function () {
            var readout = sensorDriver.read();
            model.temperature.value = parseFloat(readout.temperature.toFixed(2));
            model.humidity.value = parseFloat(readout.humidity.toFixed(2));
            showValue();
            setTimeout(function () {
                sensor.read();
                }, localParams.frequency);
    }
    }
    if (sensor.initialize()) {
        console.info('Hardware %s sensor started!', pluginName);
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor!');
    } 

}

function simulate() {
 interval = setInterval(function () {
 model.value = !model.value;
 showValue();
 }, localParams.frequency);
 console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info('Temperature: %s C, humidity %s \%',
    model.temperature.value, model.humidity.value);
};
