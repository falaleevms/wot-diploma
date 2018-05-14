var utils = require('./../../utils/utils.js'),
  resources = require('./../../resources/model'),
  observer = resources.observer;

var interval, me, pluginName, pollInterval;
var localParams = {'simulate': false, 'frequency': 5000};

ipAddr="192.168.0.112"

function connectHardware() {
  var coap = require('coap'),
    bl = require('bl');

  var actuator = {
    read: function () {
       req = coap.request({host: ipAddr,
                              pathname: '/',
                              method: 'GET',
                              options: {'Accept': 'application/json'}})

       req.on('response', function (res) {
         console.info('CoAP response code', res.code);
         if (res.code !== '2.05')
           console.log("Error while contacting CoAP service: %s", res.code);

         res.pipe(bl(function (err, data) {
           var json = JSON.parse(data);
           me.volume = json.volume;
           showValue();
         }));
       })
       req.end();

    },
    write: function (value)  {
        req = coap.request({host: ipAddr,
                            pathname: '/volume',
                            method: 'PUT',
                            options: {'Accept': 'application/json'}
                          })

        req.write(JSON.stringify({volume: value}))

        req.on('response', function(res) {
          res.pipe(process.stdout);
          console.log(res.code)
        })
        req.end()
    }
  };

  heaterValueObserver=observer.get('things.coapDevice.actuators.heater');
  heaterValueObserver.on('change', function (changes) {
          actuator.write(heaterValueObserver.subject.volume)
      });

  console.info('%s plugin started!', pluginName);
};

function configure() { //#G
  utils.addDevice('coapDevice', 'A CoAP Device',
    'A CoAP Device',
    {},
    {
      'heater': {
        'name': 'warm-heater',
        'description' : 'An ambient heater',
        'value': 0
      }
    });
  me = resources.things.coapDevice.actuators.heater;
  pluginName = resources.things.coapDevice.name;
};


exports.start = function (params, app) {
  localParams = params;
  configure(app);

  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    clearInterval(pollInterval);
  }
  console.info('%s plugin stopped!', pluginName);
};

function simulate() {
  interval = setInterval(function () {
    me.heaters = utils.randomInt(0, 1000);
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info('CO2 Level: %s ppm', me.value);
};
