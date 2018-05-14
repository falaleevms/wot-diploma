var express = require('express'),
 router = express.Router(),
 resources = require('./../resources/model'),
 observer = resources.observer;

router.route('/coapDevice/heater').get(function (req, res, next){
     req.result = resources.things.coapDevice.actuators.heater;
     next()
}).put(function(req, res, next) {
     console.log(observer.subject.things.coapDevice.actuators.heater)
     observer.get('things.coapDevice.actuators.heater').set('volume', req.body.volume)
     req.result = resources.things.coapDevice.actuators.heater;
     next();
});

module.exports = router;
