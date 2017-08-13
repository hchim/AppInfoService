var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var conf = require("./config");
var middlewares = require('service-middlewares')(conf)

//routes
var index = require('./routes/index');
var suggestions = require('./routes/suggestions');
var appconfigs = require('./routes/appconfigs')

var app = express();
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index)
app.use('/confs', appconfigs)

//request signature checkup
if (conf.get("env") !== 'test') {
    app.use(middlewares.signature_middleware)
}
// setup routes
app.use('/suggestions', suggestions);

app.use(middlewares.error_404_middleware);
if (conf.get("env") !== 'production') {
    app.use(middlewares.error_500_middleware_dev);
} else {
    app.use(middlewares.error_500_middleware_prod)
}

module.exports = app;
