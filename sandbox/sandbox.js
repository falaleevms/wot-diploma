const Gpio = require('onoff').Gpio;
const readline = require('readline');
const dhtSensor = require("node-dht-sensor");

var led = new Gpio(4, 'out'),
    interval;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.on('line', (input) => {
  if (input=='on') {
    led.write(1)
  }
  else if (input=='off') {
    led.write(0)
  }
  else if (input=='temp') {
    dhtSensor.read(11, 17, function(err, temperature, humidity) {
        if (!err) {
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );
        }
    });
  }
  else {
    console.log("Type on/off/temp");
  }
  // rl.prompt();
});

// Ctrl+C
process.on('SIGINT', function () {
 clearInterval(interval);
 rl.close()
 led.writeSync(0);
 led.unexport();
 console.log('Bye, bye!');
 process.exit();
});
