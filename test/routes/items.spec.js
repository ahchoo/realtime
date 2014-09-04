/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')

describe('Routes test', function () {
  describe('Items', function () {
    var app
    var itemId
    
    before(function (done) {
      app = require('../../app')
      require('mockgoose')(require('mongoose'))
      require('../../fixture')(function () {
        require('mongoose').disconnect(function () {
          done()
        })
      })
    })

    after(function () {
      require('mongoose').disconnect()
    })

    describe('POST /api/items', function () {
      it('expect create a item info', function (done) {
        request(app)
          .post('/api/items')
          .type('form')
          .send({
            title: 'stub title',
            price: 111
          })
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.title).to.be('stub title')
            expect(res.body.data.price).to.be(111)

            itemId = res.body.data._id

            done()
          })
      })
    })

    describe('GET /api/items', function () {
      it('expect get all items info', function (done) {
        request(app)
          .get('/api/items')
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.length).to.be(3)
            expect(res.body.data[2].title).to.be('stub title')
            expect(res.body.data[2].price).to.be(111)
            done()
          })
      })
    })

    describe('GET /api/items/:itemId', function () {
      it('expect get a specific item info', function (done) {
        expect(itemId).to.be.ok()
        request(app)
          .get('/api/items/' + itemId)
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.title).to.be('stub title')
            expect(res.body.data.price).to.be(111)
            done()
          })
      })
    })

    describe('DELETE /api/items/:itemId', function () {
      it('expect remove a specific item', function (done) {
        expect(itemId).to.be.ok()
        request(app)
          .delete('/api/items/' + itemId)
          .end(function (err, res) {
            expect(err).to.not.be.ok()
            expect(res.body.data).to.be.ok()
            expect(res.body.data.title).to.be('stub title')
            expect(res.body.data.price).to.be(111)

            request(app)
              .get('/api/items/')
              .end(function (err, res) {
                expect(err).to.not.be.ok()
                expect(res.body.data).to.be.ok()
                expect(res.body.data.length).to.be(2)
                done()
              })
          })
      })
    })
  })
})
