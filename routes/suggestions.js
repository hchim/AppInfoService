var express = require('express');
var router = express.Router();
var Suggestion = require("../models/Suggestion");

/*
* Add suggestion
*/
router.post("/", function(req, res, next) {
  var model = req.body['device[model]'];
  var brand = req.body['device[brand]'];
  var serial = req.body['device[serial]'];
  var os_name = req.body['os[os_name]'];
  var sdk_int = req.body['os[sdk_int]'];
  var sdk_int_val = parseInt(sdk_int);
  var os_type = req.body['os[os_type]'];
  var fingerprint = req.body['os[fingerprint]'];

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
        console.log(err);
      return next(err);
    }

    res.json({
      '_id': suggestion._id,
      'createTime': suggestion.createTime
    });
  });
});

module.exports = router;
