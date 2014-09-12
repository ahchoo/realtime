/* global describe, beforeEach, afterEach, it */

var should = require('should')
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
        res.body.should.match({
          data: {
            title: 'Filco Blue',
            price: 150
          }
        })

        models.Item.find().exec().then(function (items) {
          items.should.have.length(3)

          done()
        })
      })
  })

  it('should get all items info', function (done) {
    request(app)
      .get('/api/items')
      .end(function (err, res) {
        res.body.data.should.have.length(2)

        res.body.should.match({
          data: [{
            title: 'iPhone 6',
            description: 'bigger than bigger',
            price: 750
          }, {
            title: 'Burger',
            description: 'tasty',
            price: 8
          }]
        })

        done()
      })
  })

  it('should get an item with id', function (done) {
    request(app)
      .get('/api/items/' + ids.iphone.toString())
      .end(function (err, res) {
        res.body.should.match({
          data: {
            title: 'iPhone 6',
            description: 'bigger than bigger',
            price: 750
          }
        })

        done()
      })
  })


  it('should remove an item', function (done) {
    request(app)
      .delete('/api/items/' + ids.iphone.toString())
      .end(function (err, res) {
        res.body.should.match({
          data: {
            title: 'iPhone 6',
            description: 'bigger than bigger',
            price: 750
          }
        })

        models.Item.find().exec().then(function (items) {
          items.should.have.length(1)
          done()
        })
      })
  })

})
