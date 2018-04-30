var httpServer = require('./servers/http'),
    resources = require('./resources/model')
    wsServer = require('./servers/websockets');

var pirPlugin = require('./plugins/internal/pirPlugin'),
    dhtPlugin = require('./plugins/internal/DHT11Plugin.js');
    ledsPlugin = require('./plugins/internal/ledsPlugin'),
    coapPlugin = require('./plugins/external/coapPlugin');

pirPlugin.start({'simulate': false, 'frequency': 2000});
dhtPlugin.start({'simulate': false, 'frequency': 10000});
ledsPlugin.start({'simulate': false, 'frequency': 10000});
coapPlugin.start({'simulate': false, 'frequency': 10000});

var server = httpServer.listen(resources.pi.port, function () {
    wsServer.listen(server);
    console.info('Your WoT Pi is up and running on port %s',
    resources.pi.port);
});
