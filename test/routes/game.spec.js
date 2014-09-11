/* global describe, beforeEach, afterEach, it */

var expect = require('expect.js')
var request = require('supertest')
var mockgoose = require('mockgoose')
var models = require('../../lib/models')
var _ = require('underscore')

describe('game api', function () {
  var app
  var item

  beforeEach(function (done) {
    app = require('../../app')
    models.Item.create({
      title: 'iPhone 10',
      description: 'am i see this version',
      price: 10000
    }).then(function () {
      return models.Item.find().exec()
    }).then(function (items) {
      item = items[0]
      return models.Game.create({
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
        expect(_.pick(game1, 'capacity', 'status', 'countdown')).to.eql({
          capacity: 1,
          status: 'sss',
          countdown: 2
        })
        expect(_.pick(game1.item, 'title', 'price')).to.eql({
          title: item.title,
          price: item.price
        })
        done()
      })
  })

  it('should get a game info', function (done) {
    models.Game.find().exec().then(function (games) {
      var game1 = games[0]

      request(app)
        .get('/api/games/' + String(game1._id))
        .end(function (err, res) {
          expect(res.body.error).to.not.be.ok()
          expect(_.pick(res.body.data, 'capacity', 'status', 'countdown')).to.eql({
            capacity: game1.capacity,
            status: game1.status,
            countdown: game1.countdown
          })
          expect(_.pick(res.body.data.item, 'title', 'price')).to.eql({
            title: item.title,
            price: item.price
          })
          done()
        })
    })
  })

  it('should remove a game', function (done) {
    models.Game.find().exec().then(function (games) {
      var game1 = games[0]
      request(app)
        .delete('/api/games/' + String(game1._id))
        .end(function (err, res) {
          expect(res.body.error).to.not.be.ok()
          expect(_.pick(res.body.data, 'capacity', 'status', 'countdown')).to.eql({
            capacity: game1.capacity,
            status: game1.status,
            countdown: game1.countdown
          })
          expect(_.pick(res.body.data.item, 'title', 'price')).to.eql({
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
})
