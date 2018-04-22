var express = require('express'),
 router = express.Router(),
 resources = require('./../resources/model');
 var observer = resources.observer

 router.route('/').get(function (req, res, next) {
  res.send(resources.pi.actuators);
 });
 router.route('/buzzer').get(function (req, res, next) {
  res.send(resources.pi.actuators.buzzer);

 });
 router.route('/leds').get(function (req, res, next) {
  res.send(resources.pi.actuators.leds);
});
router.route('/leds/:id').get(function (req, res, next) {
  res.send(resources.pi.actuators.leds[req.params.id]);
}).put(function(req, res, next) { 
  var selectedLed = resources.pi.actuators.leds[req.params.id];
  observer.get('pi.actuators.leds.'+req.params.id).set('value', req.body.value)
  req.result = selectedLed;
  next();
});

 module.exports = router;
