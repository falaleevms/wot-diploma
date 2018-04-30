var coap        = require('coap')

payload={volume: 2}
// the default CoAP port is 5683

req = coap.request({host: 'localhost',
                         pathname: '/volume',
                         method: 'PUT',
                         options: {'Accept': 'application/json'}})
req.write(JSON.stringify(payload))

req.on('response', function(res) {
  res.pipe(process.stdout);
  console.log(res.code)
  res.on('end', function() {
    process.exit(0)
  })
})

req.end()
