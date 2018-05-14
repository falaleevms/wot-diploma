var WebSocketServer = require('ws').Server,
  resources = require('./../resources/model')
  var observer = resources.observer;

exports.listen = function(server) {
  var wss = new WebSocketServer({server: server});
  console.info('WebSocket server started...');
  wss.on('connection', function (ws, req) {
    console.info("New WebSocket subscriber");
    try {
      observerPath = req.url.replace(/(^\/|\/$)/g, '').replace(/\//g, '.');
      thisObserver = observer.get(observerPath);
      thisObserver.on('change', function (changes) {
          console.log(changes.value);
          ws.send(JSON.stringify(changes[0].object), function () {});
      });
    }
    catch (e) {
      console.log('Unable to observe %s resource!', url);
    };
  });
};

function selectResouce(url) {
  var parts = url.split('/');
  parts.shift();
  var result = resources;
  for (var i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  return result;
}
