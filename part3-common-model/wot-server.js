var httpServer = require('./servers/http'),
    observer = require('./resources/model')
    wsServer = require('./servers/websockets'),
    model = observer.subject;
var pirPlugin = require('./plugins/internal/pirPlugin');
//     dhtPlugin = require('./plugins/internal/DHT11Plugin.js');
var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin; //,
var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
//     coapPlugin = require('./plugins/external/coapPlugin');

pirPlugin = new PirPlugin({'simulate': false, 'frequency': 2000});
pirPlugin.start();
// dhtPlugin.start({'simulate': false, 'frequency': 10000});
ledsPlugin = new LedsPlugin({'frequency': 10000});
ledsPlugin.start();
// coapPlugin.start({'simulate': false, 'frequency': 10000});
// console.debug(model)
var server = httpServer.listen(model.customFields.port, function () {
    wsServer.listen(server);
    console.info('Your WoT Pi is up and running on port %s',
    model.customFields.port);
});
