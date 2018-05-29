var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var interval, sensor, model;
var PirPlugin = exports.PirPlugin = function (params) {
  CorePlugin.call(this, params, 'pir', stop);
  model = this.model;
  this.addValue(false);
};

util.inherits(PirPlugin, CorePlugin);

function stop() {
  sensor.unexport();
  console.info('%s plugin stopped!', pluginName);
};

PirPlugin.prototype.connectHardware = function() {
    var Gpio = require('onoff').Gpio;
    sensor = new Gpio(this.model.values.presence.customFields.gpio, 'in', 'both');
    var self=this;
    sensor.watch(function (err, value) {
        if (err) exit(err);
        // model.value = !!value;
        self.addValue(!!value);
        self.showValue();
    });
    console.info('Hardware %s sensor started!', model.name);
};

PirPlugin.prototype.createValue = function (value){
  return {"presence": value, "timestamp": utils.isoTimestamp()};
};
