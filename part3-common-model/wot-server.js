var httpServer = require('./servers/http'),
    observer = require('./resources/model')
    wsServer = require('./servers/websockets'),
    model = observer.subject;

var dhtPlugin = require('./plugins/internal/DHT11Plugin').Dht11Plugin;
var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
var BuzzerPlugin = require('./plugins/internal/buzzerPlugin').BuzzerPlugin;
//     coapPlugin = require('./plugins/external/coapPlugin');

pirPlugin = new PirPlugin();
ledsPlugin = new LedsPlugin();
dhtPlugin = new dhtPlugin();
buzzerPlugin = new BuzzerPlugin();

pirPlugin.start();
ledsPlugin.start();
dhtPlugin.start();
buzzerPlugin.start();

// coapPlugin.start({'simulate': false, 'frequency': 10000});
// console.debug(model)
var server = httpServer.listen(model.customFields.port, function () {
    wsServer.listen(server);
    console.info('Your WoT Pi is up and running on port %s',
    model.customFields.port);
});
