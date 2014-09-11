/* global describe, beforeEach, afterEach, it */

var expect = require('expect.js')
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
        expect(res.body.error).to.not.be.ok()
        expect(_.pick(res.body.data, 'email', 'name')).to.eql({
          email: 'fuqiangstupid@ahchoo.com',
          name: 'fuqiangstupid'
        })
        models.User.find().exec().then(function (users) {
          expect(users.length).to.be(2)
          done()
        })
      })
  })
})

