/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')
var mockgoose = require('mockgoose')
var models = require('../../lib/models')
var md5 = require('MD5')

describe('auth api', function () {
  var app

  beforeEach(function (done) {
    app = require('../../app')

    models.User.create({
      email: 'test@ahchoo.com',
      password: md5('123'),
      name: 'Ahchoo Tech',
      token: 'abc'
    }, function (err, user) {
      done()
    })
  })

  afterEach(function () {
    mockgoose.reset()
  })

  it('should login successfully', function (done) {
    request(app)
      .post('/api/auth')
      .type('form')
      .send({
        email: 'test@ahchoo.com',
        password: md5('123')
      })
      .end(function (err, res) {
        expect(res.body).to.eql({
          data: {
            email: 'test@ahchoo.com',
            name: 'Ahchoo Tech',
            token: 'abc'
          }
        })

        done()
      })
  })

  it('should fail to login if there no such account exists', function (done) {
    request(app)
      .post('/api/auth')
      .type('form')
      .send({
        email: 'foo@bar.com',
        password: md5('abcd')
      })
      .end(function (err, res) {
        expect(res.body).to.eql({
          error: {message: 'Unmatched email and password'}
        })

        done()
      })
  })

  it('should fail to login if email is not correct', function (done) {
    request(app)
      .post('/api/auth')
      .type('form')
      .send({
        email: 'test@ahchoo.com',
        password: md5('abcd')
      })
      .end(function (err, res) {
        expect(res.body).to.eql({
          error: {message: 'Unmatched email and password'}
        })

        done()
      })
  })

  it('should fail to login if password is not correct', function (done) {
    request(app)
      .post('/api/auth')
      .type('form')
      .send({
        email: 'foo@bar.com',
        password: md5('123')
      })
      .end(function (err, res) {
        expect(res.body).to.eql({
          error: {message: 'Unmatched email and password'}
        })

        done()
      })
  })

})
