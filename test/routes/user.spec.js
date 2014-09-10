/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')
var md5 = require('MD5')

describe('Routes test', function () {
  describe('Users', function () {
    var app
    var email = 'test_new@ahchoo.com'
    var password = md5('husky')
    var name = 'test'

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

    describe('POST /api/users', function () {
      it('expect create a user', function (done) {
        request(app)
          .post('/api/users')
          .type('form')
          .send({
            email: email,
            name: name,
            password: password
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.email).to.be(email)
            expect(res.body.data.name).to.be(name)
            expect(res.body.data.token).to.be.ok()
            done()
          })
      })
    })
  })
})
