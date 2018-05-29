var utils = require('./../utils/utils.js'),
  util = require('util'),
  _ = require('lodash/collection'),
  observer = require('./../resources/model');


var CorePlugin = exports.CorePlugin = function (params, propertyId, doStop, actionsIds, doAction) {
  if (params) {
    this.params = params;
  } else {
    this.params = {'frequency': 5000};
  }

  this.doAction = doAction;
  this.doStop = doStop;
  this.actions = actionsIds;
  this.observer = utils.findPropertyObserver(propertyId); 
  this.model = this.observer.subject
};

CorePlugin.prototype.start = function () {
  if (this.actions) this.observeActions();
  this.connectHardware();
  console.info('[plugin started] %s', this.model.name);
};

CorePlugin.prototype.stop = function () {
  if (this.doStop) this.doStop();
  console.info('[plugin stopped] %s', this.model.name);
};


CorePlugin.prototype.connectHardware = function () {
  throw new Error('connectedHardware() should be implemented by Plugin');
};

CorePlugin.prototype.showValue = function () {
  console.info('Current value for %s is %s', this.model.name, util.inspect(this.model.data[this.model.data.length-1]));
};

CorePlugin.prototype.observeActions = function () {
  var self = this;
    _.forEach(self.actions, function (actionId) {
        thisActionObserver=observer.get('links.actions.resources.'+actionId+'.data')

        thisActionObserver.on('change',  function (changes) {
          if (changes.type == 'added') {
            console.info('[plugin add action detected] %s', actionId);
            var action = model.links.actions.resources[actionId].data[changes.index];
            self.doAction(action);
          }
        });
    })
};

CorePlugin.prototype.createValue = function (data) {
  throw new Error('createValue(data) should be implemented by Plugin');
};

CorePlugin.prototype.addValue = function(data) {
  utils.cappedPush(this.observer.get("data"), this.createValue(data));
};
