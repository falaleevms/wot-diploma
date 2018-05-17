var observe = require('observe')
var resources = require("./resources.json");

// module.exports = resources;
module.exports = observe(resources)
