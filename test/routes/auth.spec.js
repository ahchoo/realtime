/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')

describe('Routes test', function () {
  describe('Auth', function () {
    var app
    var username = 'fu'
    var password = '202cb962ac59075b964b07152d234b70'

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
            username: username,
            password: password
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.username).to.be(username)
            expect(res.body.data.token).to.be.ok()
            done()
          })
      })

      it('expect login fail with wrong password', function (done) {
        request(app)
          .post('/api/auth')
          .type('form')
          .send({
            username: username,
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
            username: 'stub username',
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
