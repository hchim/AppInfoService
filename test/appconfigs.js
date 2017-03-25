/**
 * Created by huiche on 1/13/17.
 */
var assert = require('assert');
var mongoose = require('mongoose');
var conf = require("../config");
var request = require('request');
var expect = require('Chai').expect;
var port = conf.get('server.port');
var ip = conf.get("server.ip");
var dbUrl = conf.get('mongodb.url');
var endpoint = 'http://' + ip + ':' + port + '/confs/';
const os = require('os');

describe('/confs', function() {

    before(function(done) {
        mongoose.connect(dbUrl, function (err) {
            if (err) {
                return done(err);
            }
            console.log("Connected to mongodb: " + dbUrl);
            mongoose.set('debug', true);
            done();
        });
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    describe('POST \'/confs\'', function() {
        it('should successfully return configs.', function(done) {
            var formData = {
                appName: 'SleepAiden',
                appVersion: '1.5.6',
                device: {
                    model: 'Nexus 4',
                    brand: 'google',
                    serial: 'fakeserialnum'
                },
                "os": {
                    os_name: 'Android',
                    sdk_int: 22,
                    os_type: "user",
                    fingerprint: "fakefingerprint"
                },
            };
            request.post({url: endpoint, form: formData,
                headers: {
                    'is-internal-request': 'YES'
                }
            }, function (err, res, body){
                if (err) done(err);

                var json = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(json.appName).to.equal(formData.appName);
                done();
            });
        });
    });

});