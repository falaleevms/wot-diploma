

const Gpio = require('onoff').Gpio;
const readline = require('readline');
const dhtSensor = require("node-dht-sensor");


var led = new Gpio(4, 'out'),
    buzzer = new Gpio(22, 'out'),
    pir = new Gpio(18, 'in','both'),
    interval;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


alarm = function () {
  pir.unwatch()
  i = 2;
  i = i*2;
  interval = setInterval(function(){
      buzzer.writeSync(buzzer.readSync() ^ 1);
      i -= 1;
      console.log(i)
      if (i == 0) {
          clearInterval(interval);
          buzzer.writeSync(0);

          startPir();
      }
  }, 100);
  console.log("end alarm")
}

startPir = function (){
    pir.watch(function (err,value) {
        if (! err) {
          alarm();
        }
    });
    console.log("end start pir")
}

startPir();

rl.on('line', (input) => {
  if (input=='on') {
    led.write(1)
  }
  else if (input=='off') {
    led.write(0)
    buzzer.write(0)
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
 buzzer.writeSync(0);
 led.unexport();
 console.log('Bye, bye!');
 process.exit();
});
