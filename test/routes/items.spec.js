/* global describe, beforeEach, afterEach, it */

var expect = require('expect.js')
var request = require('supertest')
var mockgoose = require('mockgoose')
var ObjectId = require('mongoose').Types.ObjectId
var _ = require('underscore')
var models = require('../../lib/models')

describe('Items test', function () {
  var app
  var ids = {}

  beforeEach(function (done) {
    app = require('../../app')

    ids.iphone = ObjectId()
    ids.burger = ObjectId()

    models.Item.create({
      _id: ids.iphone,
      title: 'iPhone 6',
      description: 'bigger than bigger',
      price: 750
    }).then(function () {
      return models.Item.create({
        _id: ids.burger,
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
        var item = res.body.data

        expect(item._id).to.be.ok()
        expect(item.title).to.be('Filco Blue')
        expect(item.price).to.be(150)

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

        var iphone = _.find(items, function (item) {
          return item._id === ids.iphone.toString()
        })

        expect(iphone._id).to.be(ids.iphone.toString())
        expect(iphone.title).to.be('iPhone 6')
        expect(iphone.description).to.be('bigger than bigger')
        expect(iphone.price).to.be(750)

        var burger = _.find(items, function (item) {
          return item._id === ids.burger.toString()
        })

        expect(burger._id).to.be(ids.burger.toString())
        expect(burger.title).to.be('Burger')
        expect(burger.description).to.be('tasty')
        expect(burger.price).to.be(8)

        done()
      })
  })

  it('should get an item with id', function (done) {
    request(app)
      .get('/api/items/' + ids.iphone.toString())
      .end(function (err, res) {
        var iphone = res.body.data

        expect(iphone._id).to.be(ids.iphone.toString())
        expect(iphone.title).to.be('iPhone 6')
        expect(iphone.description).to.be('bigger than bigger')
        expect(iphone.price).to.be(750)

        done()
      })
  })


  it('should remove an item', function (done) {
    request(app)
      .delete('/api/items/' + ids.iphone.toString())
      .end(function (err, res) {
        var item = res.body.data

        expect(item).to.be.ok()

        models.Item.find().exec().then(function (items) {
          expect(items.length).to.be(1)
          expect(items[0].id).to.be(ids.burger.toString())

          done()
        })
      })
  })

})
