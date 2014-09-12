/* global describe, beforeEach, afterEach, it */

var should = require('should')
var request = require('supertest')
var mockgoose = require('mockgoose')
var _ = require('underscore')
var models = require('../../lib/models')
var md5 = require('MD5')

describe('user api', function () {
  var app

  beforeEach(function (done) {
    app = require('../../app')

    models.User.create({
      email: 'test@test.com',
      name: 'test',
      password: md5('test')
    }).then(function () {
      done()
    })
  })

  afterEach(function () {
    mockgoose.reset()
  })

  it('should create a user', function (done) {
    request(app)
      .post('/api/users')
      .type('form')
      .send({
        email: 'fuqiangstupid@ahchoo.com',
        name: 'fuqiangstupid',
        password: md5('no pass')
      })
      .end(function (err, res) {
        res.body.should.match({
          data: {
            email: 'fuqiangstupid@ahchoo.com',
            name: 'fuqiangstupid',
            token: String
          }
        })

        models.User.find().exec().then(function (users) {
          users.should.have.length(2)
          done()
        })
      })
  })
})
