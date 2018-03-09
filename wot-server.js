var httpServer = require('./servers/http'),
    resources = require('./resources/model');

var pirPlugin = require('./plugins/internal/pirPlugin'),
    dhtPlugin = require('./plugins/internal/DHT11Plugin.js');
    // ledsPlugin = require('./plugins/ledsPlugin');

 pirPlugin.start({'simulate': false, 'frequency': 2000});
 dhtPlugin.start({'simulate': false, 'frequency': 10000});

var server = httpServer.listen(resources.pi.port, function () {
    console.info('Your WoT Pi is up and running on port %s',
    resources.pi.port);
});
