var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Suggestion = require("appinfoservicemodels").Suggestion(mongoose.connection);
var utils = require('servicecommonutils')
var conf = require("../config");
var metric = require('metricsclient')(conf)
var winston = utils.getWinston(conf.get('env'))

/*
* Add suggestion
*/
router.post("/", function(req, res, next) {
    metric.increaseCounter('AppInfoService:Usage:Suggestion:Add', function (err, jsonObj) {
        if (err != null)
            winston.log('error', 'Failed to invoke increaseCounter.', err)
    })

    var model = utils.nestedReqField(req.body, 'device', 'model')
    var brand = utils.nestedReqField(req.body, 'device', 'brand')
    var serial = utils.nestedReqField(req.body, 'device', 'serial')
    var os_name = utils.nestedReqField(req.body, 'os', 'os_name')
    var sdk_int = utils.nestedReqField(req.body, 'os', 'sdk_int')
    var sdk_int_val = parseInt(sdk_int);
    var os_type = utils.nestedReqField(req.body, 'os', 'os_type')
    var fingerprint = utils.nestedReqField(req.body, 'os', 'fingerprint')

    var suggestion = new Suggestion({
        userId: req.body.userId,
        appName: req.body.appName,
        appVersion: req.body.appVersion,
        message: req.body.message,
        device: {
            model: model ? model : '',
            brand: brand ? brand : '',
            serial: serial ? serial : ''
        },
        "os": {
            os_name: os_name ? os_name : '',
            sdk_int: isNaN(sdk_int_val) ? 0 : sdk_int_val,
            os_type: os_type ? os_type : '',
            fingerprint: fingerprint ? fingerprint : ''
        }
    });

    suggestion.save(function (err, suggestion) {
        if (err) {
            return next(err);
        }

        res.json(utils.encodeResponseBody(req, {
            '_id': suggestion._id,
            'createTime': suggestion.createTime
        }));
    });
});

module.exports = router;
