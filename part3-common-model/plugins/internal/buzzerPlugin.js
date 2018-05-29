var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator, model;

var BuzzerPlugin = exports.BuzzerPlugin = function (params) { //#A
  CorePlugin.call(this, params, 'buzzer',
    stop, ['buzzerState'], switchOnOff);
  model = this.model;
  this.addValue(false);
};

util.inherits(BuzzerPlugin, CorePlugin);

exports.stop = function () {
  actuator.unexport();
  console.info('%s plugin stopped!', model.name);
};

function switchOnOff(value) {
    actuator.write(value.state === "true" ? 1 : 0, function () {
      console.info('Changed value %s to %s', model.name, value.state);
  });
  this.addValue(value)
};

BuzzerPlugin.prototype.connectHardware = function() {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(this.model.values.customFields.gpio , 'out');
  console.info('Hardware buzzer plugin started!');
};

BuzzerPlugin.prototype.createValue = function (data){
  return {"beeping" : data.state, "timestamp" : utils.isoTimestamp()};
};

function stop() {
  actuator.unexport();
  console.info('%s plugin stopped!', model.name);
};
