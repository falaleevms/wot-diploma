var msgpack = require('msgpack5')(),
  encode = msgpack.encode, //#A
  json2html = require('node-json2html');

module.exports = function() {
  return function (req, res, next) {
    console.info('Representation converter middleware called!');

    if (req.result) {
      if (req.accepts('json')) {
        console.info('JSON representation selected!');
        res.send(req.result);
        return;
      }

      if (req.accepts('html')) {
        console.info('HTML representation selected!');
        var transform = {'tag': 'div', 'html': '${name} : ${value}'};
        res.send(json2html.transform(req.result, transform));
        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('MessagePack representation selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      console.info('Defaulting to JSON representation!');
      res.send(req.result);
      return;

    }
    else {
      console.debug("no result in converter")
      next();
    }
  }
};
