var express = require('express'),
 router = express.Router(),
 resources = require('./../resources/model');
 var observer = resources.observer

 router.route('/').get(function (req, res, next) {
  req.result = resources.pi.actuators;
  next();
 });
 router.route('/buzzer').get(function (req, res, next) {
  req.result = resources.pi.actuators.buzzer;
  next();

 });
 router.route('/leds').get(function (req, res, next) {
  req.result = resources.pi.actuators.leds;
  next();
});
router.route('/leds/:id').get(function (req, res, next) {
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put(function(req, res, next) {
  var selectedLed = resources.pi.actuators.leds[req.params.id];
  observer.get('pi.actuators.leds.'+req.params.id).set('value', req.body.value)
  req.result = selectedLed;
  next();
});

 module.exports = router;
