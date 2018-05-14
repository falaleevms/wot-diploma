var resources = require('./../../resources/model');
var observer = resources.observer;

// 
//
// var resources =
// var observer = require('./../../resources/model');
// var resources = obsever.subject

var actuator, interval;
var model = resources.pi.actuators.leds;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};
var leds = [];

exports.start = function (params) {
  localParams = params;
  //observe(model);
  for(var ledId in model){
      observe("pi.actuators.leds." + [ledId], ledId); //leds[ledId]
  }
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
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function observe(what, ledId) {
  thisObserver = observer.get(what)
  thisObserver.on('change', function (changes) {
      switchOnOff(model[ledId].value, ledId);
      });
};

function switchOnOff(value, ledId) {
  if (!localParams.simulate) {
    leds[ledId].write(value === true ? 1 : 0, function () {
      console.info('Changed value of led %s to %s', ledId, value);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  for(var ledId in model){
      leds[ledId] = new Gpio(model[ledId].gpio , 'out');
  }
  console.info('Hardware leds plugin started!');

  // thisObserver_ = observer.get("pi.actuators.leds.1");
  // thisObserver_.on('change', function (changes) {
  //       console.info('thisObserver_');
  // });
};

function simulate() {
  interval = setInterval(function () {
    if (model.value) {
      model.value = false;
    } else {
      model.value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};
