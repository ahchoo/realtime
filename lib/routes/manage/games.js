var express = require('express')
var router = express.Router()
var models = require('../../models')
var async = require('async')
var _ = require('underscore')

router
  .route('/')
  .get(function (req, res) {
    models.Game.find().populate('item').exec(function (err, games) {
      if (err || !games) {
        games = []
      }
      res.render('manage/games', {
        title: 'Games',
        games: games
      })
    })
  })

router
  .route('/:gameId')
  .get(function (req, res) {
    var gameId = req.param('gameId')
    var title = gameId === 'new' ? 'Create Game' : 'Update Game'

    var tasks = []
    tasks.push(function (callback) {
      models.Item.find(callback)
    })
    if (gameId === 'new') {
      // Create
      tasks.push(function (items, callback) {
        res.render('manage/game', {
          title: title,
          game: {
            capacity: '',
            countdown: '',
            status: ''
          },
          items: items
        })
        callback()
      })
    } else {
      tasks.push(function (items, callback) {
        models.Game.findById(gameId, function (err, game) {
          if (!game) {
            err = new Error('Invalid game ID: ' + gameId)
          }
          callback(err, items, game)
        })
      })
      tasks.push(function (items, game, callback) {
        _.each(items, function (item) {
          if (item._id.toString() === game.item.toString()) {
            item.selected = true
          }
        })
        res.render('manage/game', {
          title: title,
          game: game,
          items: items
        })
        callback()
      })
    }

    async.waterfall(tasks, function (err, items, game) {
      if (err) {
        res.render('manage/game', {
          title: title,
          game: game || {},
          items: items || []
        })
      }
    })
  })
  .post(function (req, res) {
    var gameId = req.param('gameId')
    var title = gameId === 'new' ? 'Create Game' : 'Update Game'
    var itemId = req.param('item')
    var capacity = req.param('capacity', '')
    var countdown = req.param('countdown', '')
    var status = req.param('status', '')

    var tasks = []
    tasks.push(function (callback) {
      models.Item.find(callback)
    })
    if (gameId === 'new') {
      // Create
    } else {
      // Update
    }
  })

module.exports = router
