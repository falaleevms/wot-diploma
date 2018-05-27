var observer = require('./../resources/model');
var model = observer.subject,
  _ = require('lodash/collection');

exports.addDevice = function(id, name, description, sensors, actuators) {
  if(!model.things) {
    model.things = {};
  }
  model.things[id] = {'name' : name,
    'description' : description,
    'sensors' : sensors,
    'actuators' : actuators
  }
};

exports.extractFields = function(fields, object, target) {
  if(!target) var target = {};
  var arrayLength = fields.length;
  for (var i = 0; i < arrayLength; i++) {
    var field = fields[i];
    target[field] = object[field];
  }
  return target;
};

exports.modelToResources = function(subModel, withValue) {
  var resources = [];
  Object.keys(subModel).forEach(function(key) {
    var val = subModel[key];
    var resource = {};
    resource.id = key;
    resource.name = val['name'];
    if(withValue) resource.values = val.data[val.data.length-1];
    resources.push(resource);
  });
  return resources;
};

exports.isoTimestamp = function(){
  var date = new Date();
  return date.toISOString();
};

exports.checkNotExist = function(what, where, string, res) {
  if (! (what in where)) {
    res.status(404).send(string + ' does not exist');
    return true;
  }
  else return false;
}

exports.cappedPush = function(arrayObserver, entry) {
  if(arrayObserver.subject.length >= model.customFields.dataArraySize) {
    arrayObserver.shift();
    arrayObserver.push(entry);
  } else {
    arrayObserver.push(entry);
  }
  return arrayObserver.subject;
};

exports.findObjectInArray = function(array, filterObj) {
  //TODO: should be made async (what if array is big!)
  return _.find(array, filterObj);
};

exports.findPropertyObserver = function(propertyId){
  return observer.get('links.properties.resources.'+propertyId);
};
