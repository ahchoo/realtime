var express = require('express')
var router = express.Router()
var models = require('../../models')
var async = require('async')

router
  .route('/')
  .get(function (req, res) {
    models.Game.find().populate('item').exec(function (err, games) {
      res.render('manage/games', {
        games: games
      })
    })
  })

router
  .route('/:gameId')
  .get(function (req, res) {
    var gameId = req.params.gameId
    if (gameId === 'new') {
      models.Item.find().exec().then(function (items) {
        res.render('manage/new-game', {
          items: items
        })
      })
    } else {
      models.Game.findById(gameId)
      .populate('item').exec().then(function (game) {
        res.render('manage/game', {
          game: game
        })
      })
    }
  })
  .post(function (req, res) {
    var _id = req.body._id
    var item = req.body.game.item
    var capacity = req.body.game.capacity
    var countdown = req.body.game.countdown

    var errors = []
    var tasks = []

    if (_id) {
      // TODO: currently not support update game
    } else {
      tasks.push(function (callback) {
        if (!item) errors.push('Item is required')
        if (!capacity) errors.push('Capacity is required')
        if (!countdown) errors.push('Countdown is required')

        if (errors.length) {
          callback(errors)
        } else {
          models.Game.create({
            item: item,
            capacity: capacity,
            countdown: countdown
          }, function (err, game){
            callback(err)
          })
        }

      })
    }

    tasks.push(function (callback) {
      models.Game.find().populate('item').exec(function (err, games) {
        res.render('manage/games', {
          games: games
        })
      })
    })

    async.waterfall(tasks, function (err) {
      if (!err) return
      models.Item.find().exec().then(function (items) {
        res.render('manage/new-game', {
          items: items,
          errors: err instanceof Array ? err : [err],
        })
      })
    })


  })

module.exports = router
