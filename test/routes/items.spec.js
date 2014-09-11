/* global describe, before, after, it */

var expect = require('expect.js')
var request = require('supertest')
var mockgoose = require('mockgoose')
var _ = require('underscore')
var models = require('../../lib/models')

describe('Items test', function () {
  var app

  beforeEach(function (done) {
    app = require('../../app')

    models.Item.create({
      title: 'iPhone 6',
      description: 'bigger than bigger',
      price: 750
    }).then(function () {
      return models.Item.create({
        title: 'Burger',
        description: 'tasty',
        price: 8
      })
    }).then(function () {
      done()
    })
  })

  afterEach(function () {
    mockgoose.reset()
  })

  it('should create an item', function (done) {
    request(app)
      .post('/api/items')
      .type('form')
      .send({
        title: 'Filco Blue',
        price: 150
      })
      .end(function (err, res) {
        expect(res.body.error).to.not.be.ok()

        expect(_.pick(res.body.data, 'title', 'price')).to.eql({
          title: 'Filco Blue',
          price: 150
        })

        models.Item.find().exec().then(function (items) {
          expect(items.length).to.be(3)
          done()
        })
      })
  })

  it('should get all items info', function (done) {
    request(app)
      .get('/api/items')
      .end(function (err, res) {
        var items = res.body.data

        expect(items.length).to.be(2)

        var item1 = _.find(items, function (item) {
          return item.title === 'iPhone 6'
        })

        expect(_.pick(item1, 'title', 'description', 'price')).to.eql({
          title: 'iPhone 6',
          description: 'bigger than bigger',
          price: 750
        })

        var item2 = _.find(items, function (item) {
          return item.title === 'Burger'
        })

        expect(_.pick(item2, 'title', 'description', 'price')).to.eql({
          title: 'Burger',
          description: 'tasty',
          price: 8
        })

        done()
      })
  })


  // it('should remove an item', function (done) {
  //   models.

  //   request(app)
  //     .get('/api/items/' + )
  //     .end(function (err, res) {


  //       done()
  //     })
  // })

  // describe('DELETE /api/items/:itemId', function () {
  //   it('expect remove a specific item', function (done) {
  //     expect(itemId).to.be.ok()
  //     request(app)
  //       .delete('/api/items/' + itemId)
  //       .end(function (err, res) {
  //         expect(err).to.not.be.ok()
  //         expect(res.body.data).to.be.ok()
  //         expect(res.body.data.title).to.be('stub title')
  //         expect(res.body.data.price).to.be(111)

  //         request(app)
  //           .get('/api/items/')
  //           .end(function (err, res) {
  //             expect(err).to.not.be.ok()
  //             expect(res.body.data).to.be.ok()
  //             expect(res.body.data.length).to.be(2)
  //             done()
  //           })
  //       })
  //   })
  // })
})
