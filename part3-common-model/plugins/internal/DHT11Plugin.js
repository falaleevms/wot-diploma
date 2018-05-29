var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');
var modelTemperature, modelHumidity, sensor;

var Dht11Plugin = exports.Dht11Plugin = function (params) {
  CorePlugin.call(this, params, 'temperature', stop, null, null);
  modelTemperature = this.model;
  observerHumidity = utils.findPropertyObserver('humidity');
  modelHumidity = observerHumidity.subject;
  this.addValue([0, 0]);
};

util.inherits(Dht11Plugin, CorePlugin);

stop = function () {
 sensor.unexport();
 console.info('%s plugin stopped!', pluginName);
};

Dht11Plugin.prototype.connectHardware = function() {
    var sensorDriver = require('node-dht-sensor');
    var self=this;
    var sensor = {
        initialize: function () {
            return sensorDriver.initialize(11, self.model.values.t.customFields.gpio);
        },
        read: function () {
            var readout = sensorDriver.read();
            self.addValue([parseFloat(readout.temperature.toFixed(2)),
                            parseFloat(readout.humidity.toFixed(2))]);
            self.showValues();
            setTimeout(function () {
                sensor.read();
              }, 5000);
    }
    }
    if (sensor.initialize()) {
        console.info('Hardware DHT11 sensor started!');
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor!');
    }
}

Dht11Plugin.prototype.addValue = function(values) {
  utils.cappedPush(this.observer.get("data"), {"t": values[0], "timestamp": utils.isoTimestamp()});
  utils.cappedPush(observerHumidity.get("data"), {"h": values[1], "timestamp": utils.isoTimestamp()});
};

Dht11Plugin.prototype.showValues = function () {
  console.info('Temperature: %s C, Humidity: %s \%', modelTemperature.data[modelTemperature.data.length-1].t, modelHumidity.data[modelHumidity.data.length-1].h);
};
