var mongoose = require("mongoose");
var conf = require("../config");

var sugSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    appName: {
        type: String,
        required: true
    },
    appVersion: {
        type: String,
        required: true
    },
    createTime: {type: Date, default: Date.now},
    message: {
        type: String,
        required: true
    },
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