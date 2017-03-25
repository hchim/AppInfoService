var mongoose = require("mongoose");
var conf = require("../config");

var appConfigSchema = mongoose.Schema({
    appName: {
        type: String,
        required: true
    },
    appVersion: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    createTime: {type: Date, default: Date.now}
});

// indexes
appConfigSchema.index({ appName: 1, appVersion: 1, os: 1});

if (conf.get("env") === 'production') {
    appConfigSchema.set('autoIndex', false);
} else {
    appConfigSchema.set('autoIndex', true);
}

// methods

var AppConfig = mongoose.model('AppConfig', appConfigSchema);

module.exports = AppConfig;