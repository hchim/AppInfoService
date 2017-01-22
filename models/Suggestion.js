var mongoose = require("mongoose");
var conf = require("../config");

var sugSchema = mongoose.Schema({
    userId: String,
    appName: String,
    appVersion: String,
    createTime: {type: Date, default: Date.now},
    message: String,
    device: {
        model: String,
        brand: String,
        serial: String,
    },
    "os": {
        os_name: String,
        sdk_int: Number,
        os_type: String,
        fingerprint: String,
    }
});

// indexes

sugSchema.index({ appName: 1, appVersion: 1, createTime: 1});

if (conf.get("env") === 'production') {
    sugSchema.set('autoIndex', false);
} else {
    sugSchema.set('autoIndex', true);
}

// methods

var Suggestion = mongoose.model('Suggestion', sugSchema);

module.exports = Suggestion;