var express = require('express'),
    routesCreator = require('./../routes/routesCreator'),
    resources = require('./../resources/model').subject,
    thingsRoutes = require('./../routes/things')
    observer = require('./../resources/model'),
    cors = require('cors'),
    converter = require('./../middleware/converter'),
    bodyParser = require('body-parser')
    cons = require('consolidate');

var app = express();

app.use(bodyParser.json());
app.use(cors());


// Create Routes
app.use('/', routesCreator.create(observer));

// Templating engine
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');

// Sets the public folder (for static content such as .css files & co)
app.use(express.static(__dirname + '/../public'));

app.get('/pi', function (req, res) {
 res.send('This is the WoT-Pi!')
});
app.use(converter())
module.exports = app;
