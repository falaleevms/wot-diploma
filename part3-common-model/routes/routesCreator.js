var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils');

exports.create = function (observer) {

  var model=observer.subject;

  // console.debug(model.links.properties)

  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  // Let's create the routes
  createRootRoute(model);
  createModelRoutes(model);
  createPropertiesRoutes(model);
  createActionsRoutes(model);

  return router;
};


function createRootRoute(model) {
  router.route('/').get(function (req, res, next) {

    req.model = model;
    req.type = 'root';

    var fields = ['id', 'name', 'description', 'tags', 'customFields'];
    req.result = utils.extractFields(fields, model);
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/',
      help: '/help/',
      ui: '/',
      type: 'http://model.webofthings.io/'
    });

    next();
  });
};


function createModelRoutes(model) {
  // GET /model
  router.route('/model').get(function (req, res, next) {
    req.result = model;
    req.model = model;

    res.links({
      type: 'http://model.webofthings.io/'
    });

    next();
  });
};

function createPropertiesRoutes(model) {
  var properties = model.links.properties;

  // GET /properties
  router.route(properties.link).get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';

    // req.result = properties.resources;
    req.result = utils.modelToResources(properties.resources, true);

    res.links({
      type: "http://model.webofthings.io/#properties-resource"
    });

    next();
  });

  // GET /properties/{id}
  router.route(properties.link + '/:id').get(function (req, res, next) {

    if (utils.checkNotExist(req.params.id, properties.resources, "Property", res)) return;

    req.result = reverseResults(properties.resources[req.params.id].data);
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;

    res.links({
      type: 'http://model.webofthings.io/#properties-resource'
    });

    next();
  });
};

function createActionsRoutes(model) {
  var actions = model.links.actions;

  // GET /actions
  router.route(actions.link).get(function (req, res, next) {
    req.result = utils.modelToResources(actions.resources, true);

    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  });

  // POST /actions/{actionType}
  router.route(actions.link + '/:actionType').post(function (req, res, next) {

    if (utils.checkNotExist(req.params.actionType, actions.resources, "action", res)) return;

    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    // utils.cappedPush(actions.resources[req.params.actionType].data, action);
    utils.cappedPush(observer.get('links.actions.resources.'+req.params.actionType+'.data'), action);
    res.location(req.originalUrl + '/' + action.id);

    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : action.id});

    next();
  });


  // GET /actions/{actionType}
  router.route(actions.link + '/:actionType').get(function (req, res, next) {

    if (utils.checkNotExist(req.params.actionType, actions.resources, "action", res)) return;

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });


    next();
  });

  // GET /actions/{id}/{actionId}
  router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};

function createDefaultData(resources) {
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}
