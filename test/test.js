var app = require('../app');
var request = require('supertest');

describe('IndexRoute', function() {
    request(app)
        .get('/api/books')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '4')
        .expect(200, "ok")
        .end(function(err, res){
            if (err) throw err;
        });
});