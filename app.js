var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var conf = require("./config");
var metric = require('metricsclient')(conf)
var middlewares = require('service-middlewares')(conf)
var utils = require('servicecommonutils')

var winston = utils.getWinston(conf.get('env'));

//routes
var index = require('./routes/index');
var suggestions = require('./routes/suggestions');
var appconfigs = require('./routes/appconfigs')

var app = express();

var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//api usage metric
app.use(function (req, res, next) {
    metric.increaseCounter('AppInfoService:Usage:' + req.method + ':' + req.url, function (err, jsonObj) {
        if (err != null)
            winston.log('error', 'Failed to invoke increaseCounter.', err)
        next(err)
    })
})

app.use('/', index)
app.use('/confs', appconfigs)

//request signature checkup
if (conf.get("env") !== 'test') {
    app.use(middlewares.signature_middleware)
}
// setup routes
app.use('/suggestions', suggestions);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stack trace
if (conf.get("env") === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json(utils.encodeResponseBody(req, {
            message: err.message,
            error: err,
            errorCode: 'INTERNAL_FAILURE'
        }));
    });
}

// production error handler
// no stack traces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    metric.errorMetric('AppInfoService:Error:' + req.method + ':' + req.url, err, function (error, jsonObj) {
        if (error != null)
            return res.json(utils.encodeResponseBody(req, {
                message: 'Failed to add metric. \n' + err.message,
                errorCode: 'INTERNAL_FAILURE'
            }));
        res.json(utils.encodeResponseBody(req, {
            message: err.message,
            errorCode: 'INTERNAL_FAILURE'
        }));
    })
});

module.exports = app;
