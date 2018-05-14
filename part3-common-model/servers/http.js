var express = require('express'),
    routesCreator = require('./../routes/routesCreator'),
    resources = require('./../resources/model'),
    actuatorsRoutes = require('./../routes/actuators'),
    sensorRoutes = require('./../routes/sensors'),
    thingsRoutes = require('./../routes/things')
    resources = require('./../resources/model'),
    cors = require('cors'),
    converter = require('./../middleware/converter'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(cors());

// app.use('/pi/actuators', actuatorsRoutes);
// app.use('/pi/sensors', sensorRoutes);
// app.use('/things', thingsRoutes);

// Create Routes
app.use('/', routesCreator.create(resources));

app.get('/pi', function (req, res) {
 res.send('This is the WoT-Pi!')
});
app.use(converter())
module.exports = app;
