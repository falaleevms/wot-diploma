var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator, model;
var leds = {};

var LedsPlugin = exports.LedsPlugin = function (params) { //#A
  CorePlugin.call(this, params, 'leds',
    stop, ['ledState'], switchOnOff);
  model = this.model;
  this.addValue(false);
};
util.inherits(LedsPlugin, CorePlugin);

function stop() {
  actuator.unexport();
  console.info('%s plugin stopped!', pluginName);
};

function observe(what, ledId) {
  thisObserver = observer.get(what)
  thisObserver.on('change', function (changes) {
      switchOnOff(model[ledId].value, ledId);
      });
};

function switchOnOff(value) {
    let ledsIdToSwitch;
    if (value.ledId=="All"){
      ledsIdToSwitch=Object.keys(leds)
    }
    else {
       ledsIdToSwitch=[value.ledId]
    }
    for (var i=0; i<ledsIdToSwitch.length; i++){
      let ledId=ledsIdToSwitch[i];
      leds[ledId].write(value.ledState === true ? 1 : 0, function () {
        console.info('Changed value of led %s to %s', ledId, value.ledState);
      });
    }
    this.addValue(value)

};

LedsPlugin.prototype.connectHardware = function() {
  var Gpio = require('onoff').Gpio;
  for(var ledId in this.model.values){
      leds[ledId] = new Gpio(this.model.values[ledId].customFields.gpio , 'out');
      console.info('led stated: ' + this.model.values[ledId].name);
  }
};

LedsPlugin.prototype.createValue = function (data){
  let createdValue={};
  let state = data.ledState;
  let id = data.ledId;

  for (var ledId in this.model.values){
    if (id == "All") {
      createdValue[ledId]=state;
    }
    else if (id == ledId) {
      createdValue[ledId]=state;
    }
  }
  createdValue["timestamp"] = utils.isoTimestamp();
  return createdValue;
};
