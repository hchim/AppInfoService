/**
 * Created by huiche on 1/13/17.
 */
var assert = require('assert');
var mongoose = require('mongoose');
var conf = require("../config");
var request = require('request');
var expect = require('Chai').expect;
var Suggestion = require('../models/Suggestion');
var port = conf.get('server.port');
var ip = conf.get("server.ip");
var dbUrl = conf.get('db.mongodb.url');
var endpoint = 'http://' + ip + ':' + port + '/suggestions/';
const os = require('os');

describe('/suggestions', function() {

    before(function(done) {
        mongoose.connect(dbUrl, function (err) {
            if (err) {
                return done(err);
            }
            console.log("Connected to mongodb: " + dbUrl);
            mongoose.set('debug', true);
            Suggestion.remove({});
            done();
        });
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    describe('POST \'/suggestions\'', function() {
        it('should successfully add suggestion.', function(done) {
            var formData = {
                userId: '587c7c7873f1e7661ad7d288',
                appName: 'SleepRecord',
                appVersion: '1.5.6',
                email: 'test@contact.com',
                message: "Test suggestion",
                platform: os.platform(),
                osVersion: os.release(),
            };
            request.post({url: endpoint, form: formData}, function (err, res, body){
                if (err) done(err);

                var json = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(json.tag).to.equal(formData.tag);
                done();
            });
        });
    });
});