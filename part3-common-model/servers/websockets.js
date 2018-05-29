var WebSocketServer = require('ws').Server;
var observer = require('./../resources/model');
var resources = observer.subject;

// setInterval(function () {
//   console.debug("interval")
// }, 10);

exports.listen = function(server) {
  var wss = new WebSocketServer({server: server});
  console.info('WebSocket server started...');
  wss.on('connection', function (ws, req) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    console.info("New WebSocket subscriber ("+req.url+")");
    try {
      let observerPath = req.url.replace(/(^\/|\/$)/g, '').replace(/\//g, '.');
      observerPath = selectResouce(observerPath);
      let thisObserver = observer.get(observerPath);
      thisObserver.on('change', function (changes) {
          if (ws.isAlive === true) ws.send(JSON.stringify(thisObserver.subject), function () {});
      });
    }
    catch (e) {
      console.log(e);
    };
  });

  wss.on('close', function close() {
      console.info("Websocket server stopped...");
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
          ws.isAlive = false;
          ws.ping(noop);
      });
  }, 3000);

};

function selectResouce(url) { //#E
  var parts = url.split('.');
  var result;
  if (parts[0] === 'actions') {
    result = "links.actions.resources."+parts[1]+".data";
  } else if (parts[0] === 'properties'){
    result = "links.properties.resources."+parts[1]+".data";
  }
  return result;
}

function heartbeat() {
  this.isAlive = true;
}

function noop() {}

// function selectResouce(url) {
//   var parts = url.split('/');
//   parts.shift();
//   var result = resources;
//   for (var i = 0; i < parts.length; i++) {
//     result = result[parts[i]];
//   }
//   console.debug("debug");
//   console.debug(result);
//   return result;
// }
