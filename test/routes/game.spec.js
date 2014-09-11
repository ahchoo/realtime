/* global describe, beforeEach, afterEach, it */

var expect = require('expect.js')
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
        expect(res.body.error).to.not.be.ok()
        expect(res.body.data._id).to.be.ok()
        expect(_.pick(res.body.data, 'capacity', 'status', 'countdown')).to.eql({
          capacity: 1000,
          status: 'stub status',
          countdown: 999
        })
        expect(_.pick(res.body.data.item, 'title', 'price')).to.eql({
          title: item.title,
          price: item.price
        })
        models.Game.find().exec().then(function(games) {
          expect(games.length).to.be(2)
          done()
        })
      })
  })

  it('should get all games info', function (done) {
    request(app)
      .get('/api/games')
      .end(function (err, res) {
        expect(res.body.error).to.not.be.ok()
        var games = res.body.data
        expect(games.length).to.be(1)
        var game1 = games[0]
        expect(_.pick(game1, '_id', 'capacity', 'status', 'countdown')).to.eql({
          _id: ids.game.toString(),
          capacity: 1,
          status: 'sss',
          countdown: 2
        })
        expect(_.pick(game1.item, '_id', 'title', 'price')).to.eql({
          _id: ids.item.toString(),
          title: item.title,
          price: item.price
        })
        done()
      })
  })

  it('should get a game info with id', function (done) {
    request(app)
      .get('/api/games/' + ids.game.toString())
      .end(function (err, res) {
        expect(res.body.error).to.not.be.ok()
        expect(_.pick(res.body.data, '_id', 'capacity', 'status', 'countdown')).to.eql({
          _id: ids.game.toString(),
          capacity: 1,
          status: 'sss',
          countdown: 2
        })
        expect(_.pick(res.body.data.item, '_id', 'title', 'price')).to.eql({
          _id: ids.item.toString(),
          title: item.title,
          price: item.price
        })
        done()
      })
  })

  it('should remove a game', function (done) {
    request(app)
      .delete('/api/games/' + ids.game.toString())
      .end(function (err, res) {
        expect(res.body.error).to.not.be.ok()
        expect(_.pick(res.body.data, '_id', 'capacity', 'status', 'countdown')).to.eql({
          _id: ids.game.toString(),
          capacity: 1,
          status: 'sss',
          countdown: 2
        })
        expect(_.pick(res.body.data.item, '_id', 'title', 'price')).to.eql({
          _id: ids.item.toString(),
          title: item.title,
          price: item.price
        })
        models.Game.find().exec().then(function (games) {
          expect(games.length).to.be(0)
          done()
        })
      })
  })
})
