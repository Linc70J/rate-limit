const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function itShouldIncrease(i) {
    it('應該回傳200並持續計數,計數值為計數值為'+i+'次', function () {
        return request(app)
            .get('/')
            .then(function (response) {
                assert.equal(response.status, 200);
                expect(response.text).to.contain('IP: 127.0.0.1, Requests count: ' + i);
            })
    });
}

describe('Unit testing the / route', function () {
    // 清空資料恢復乾淨的測試環境
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("rate-limit");
        dbo.collection("users").drop(function (err, delOK) {
            if (err) throw err;
            db.close();
        });
    });

    it('應該回傳200,計數值為1次', function () {
        return request(app)
            .get('/')
            .then(function (response) {
                assert.equal(response.status, 200);
                expect(response.text).to.contain('IP: 127.0.0.1, Requests count: 1');
            })
    });

    for(i = 2; i <= 60; i++)
        itShouldIncrease(i);

    it('應該回傳Error 429', function () {
        return request(app)
            .get('/')
            .then(function (response) {
                assert.equal(response.status, 429)
            })
    });
});