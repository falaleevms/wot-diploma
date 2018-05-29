var msgpack = require('msgpack5')(),
  encode = msgpack.encode, //#A
  json2html = require('node-json2html');

module.exports = function() {
  return function (req, res, next) {
    console.info('Representation converter middleware called!');

    if (req.result) {

      req.rooturl = req.headers.host;
      // req.qp = req._parsedUrl.search;

      if (req.accepts('html')) {
        console.info('HTMl representation selected!');

        var helpers = {
          json: function (object) {
            return JSON.stringify(object);
          },
          getById: function (object, id) {
            return object[id];
          }
        };

        // Check if there's a custom renderer for this media type and resource
        if (req.type) res.render(req.type, {req: req, helpers: helpers});
        else res.render('default', {req: req, helpers: helpers});

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
