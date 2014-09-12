/* global describe, beforeEach, afterEach, it */

var expect = require('expect.js')
var should = require('should')
var request = require('supertest')
var mockgoose = require('mockgoose')
var ObjectId = require('mongoose').Types.ObjectId
var models = require('../../lib/models')
var _ = require('underscore')

describe('game api', function () {
  var app
  var ids = {}
  var item

  beforeEach(function (done) {
    app = require('../../app')

    ids.item = ObjectId()
    ids.game = ObjectId()

    models.Item.create({
      _id: ids.item,
      title: 'iPhone 10',
      description: 'am i see this version',
      price: 10000
    }).then(function () {
      return models.Item.find().exec()
    }).then(function (items) {
      item = items[0]

      return models.Game.create({
        _id: ids.game,
        item: String(item._id),
        capacity: 1,
        status: 'sss',
        countdown: 2
      })
    }).then(function () {
      done()
    })
  })

  afterEach(function () {
    mockgoose.reset()
  })

  it('should create a game', function (done) {
    request(app)
      .post('/api/games')
      .type('form')
      .send({
        item: String(item._id),
        capacity: 1000,
        status: 'stub status',
        countdown: 999
      })
      .end(function (err, res) {
        res.body.should.match({
          data: {
            _id: String,
            capacity: 1000,
            status: 'stub status',
            countdown: 999,
            item: {
              _id: String,
              title: 'iPhone 10',
              price: 10000
            }
          }
        })

        models.Game.find().exec().then(function(games) {
          games.should.have.length(2)
          done()
        })
      })
  })

  it('should get all games info', function (done) {
    request(app)
      .get('/api/games')
      .end(function (err, res) {
        res.body.data.should.have.length(1)

        res.body.should.match({
          data: [{
            _id: String,
            capacity: 1,
            status: 'sss',
            countdown: 2,
            item: {
              _id: String,
              title: 'iPhone 10',
              price: 10000
            }
          }]
        })

        done()
      })
  })

  it('should get a game info with id', function (done) {
    request(app)
      .get('/api/games/' + ids.game.toString())
      .end(function (err, res) {
        res.body.should.match({
          data: {
            _id: String,
            capacity: 1,
            status: 'sss',
            countdown: 2,
            item: {
              _id: String,
              title: 'iPhone 10',
              price: 10000
            }
          }
        })

        done()
      })
  })

  it('should remove a game', function (done) {
    request(app)
      .delete('/api/games/' + ids.game.toString())
      .end(function (err, res) {
        res.body.should.match({
          data: {
            _id: String,
            capacity: 1,
            status: 'sss',
            countdown: 2,
            item: {
              _id: String,
              title: 'iPhone 10',
              price: 10000
            }
          }
        })

        models.Game.find().exec().then(function (games) {
          games.should.have.length(0)
          done()
        })
      })
  })
})
