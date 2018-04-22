var coap        = require('coap')
  , server      = coap.createServer()

heaterData = { volume: 0 }

server.on('request', function(req, res) {
  console.log("request from: " + req.rsinfo.address + ", port: " + req.rsinfo.port + ", type: " + req.method)
  if (req.headers['Accept'] != 'application/json') {
      res.code = '4.06';
      return res.end();
  }
  payload = (JSON.parse(req.read().toString('utf8')))
  res.code = '2.05';
  res.setOption('Content-Format', 'application/json');
    switch (req.url) {
        case "/":
            if (req.method == 'GET') {
                res.end(JSON.stringify(heaterData));
            }
            else {
                res.code = '4.05';
                res.end();
            }
            break;
        case "/volume":
            if (req.method == 'GET') {
                res.end(JSON.stringify(heaterData.volume));
            }
            else if (req.method == 'PUT') {
                heaterData.volume=payload.volume;
                res.end(JSON.stringify(heaterData));
            }
            else {
                res.code = '4.05';
                res.end();
            }
            break;
        default:
            res.code = '4.04';
            res.end();
        }
})

server.listen(() => {console.log("Coap server started on port: " + server._port)})
