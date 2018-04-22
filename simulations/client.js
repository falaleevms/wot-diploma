var coap        = require('coap')

payload={volume: 5}
// the default CoAP port is 5683

var req = coap.request({host: 'localhost',
                         pathname: '/',
                         method: 'PUT'})
req.write(JSON.stringify(payload))

req.on('response', function(res) {
  res.pipe(process.stdout);
  console.log(res.code)
  res.on('end', function() {
    process.exit(0)
  })
})

req.end()
