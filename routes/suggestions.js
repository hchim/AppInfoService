var express = require('express');
var router = express.Router();
var Suggestion = require("../models/Suggestion");

/*
* Add suggestion
*/
router.post("/", function(req, res, next) {
  var suggestion = new Suggestion({
    userId: req.body.userId,
    appName: req.body.appName,
    appVersion: req.body.appVersion,
    message: req.body.message,
    platform: req.body.platform,
    osVersion: req.body.osVersion
  });

 suggestion.save(function (err, suggestion) {
    if (err) {
      return next(err);
    }

    res.json({
      '_id': suggestion._id,
      'createTime': suggestion.createTime
    });
  });
});

module.exports = router;
