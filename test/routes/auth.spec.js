/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')
var md5 = require('MD5')

describe('Routes test', function () {
  describe('Auth', function () {
    var app
    var email = 'test@ahchoo.com'
    var password = md5('husky')

    before(function (done) {
      require('mockgoose')(require('mongoose'))
      require('../../fixture')().then(function () {
        require('mongoose').disconnect(function () {
          app = require('../../app')
          done()
        })
      })
    })

    after(function () {
      require('mongoose').disconnect()
    })

    describe('POST /api/auth', function () {
      it('expect login success with correct username and password', function (done) {
        request(app)
          .post('/api/auth')
          .type('form')
          .send({
            email: email,
            password: password
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.email).to.be(email)
            expect(res.body.data.token).to.be.ok()
            done()
          })
      })

      it('expect login fail with wrong password', function (done) {
        request(app)
          .post('/api/auth')
          .type('form')
          .send({
            email: email,
            password: 'stub password'
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.error).to.be.ok()
            expect(res.body.error.message).to.be.ok()
            done()
          })
      })

      it('expect login fail with wrong username and password', function (done) {
        request(app)
          .post('/api/auth')
          .type('form')
          .send({
            email: 'stub username',
            password: 'stub password'
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.error).to.be.ok()
            expect(res.body.error.message).to.be.ok()
            done()
          })
      })

    })

  })
})
