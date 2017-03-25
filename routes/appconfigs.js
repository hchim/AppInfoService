var express = require('express');
var router = express.Router();
var utils = require('servicecommonutils')

router.post("/", function(req, res, next) {
    var model = utils.nestedReqField(req.body, 'device', 'model')
    var brand = utils.nestedReqField(req.body, 'device', 'brand')
    var os_name = utils.nestedReqField(req.body, 'os', 'os_name')

    // hard code for now, will be moved to database
    var appConfig = {
        appName: req.body.appName,
        appVersion: req.body.appVersion,
        os: os_name
    };

    res.json(utils.encodeResponseBody(req, appConfig));
});

module.exports = router;