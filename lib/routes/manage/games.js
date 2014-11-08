var express = require('express')
var router = express.Router()
var models = require('../../models')

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

module.exports = router
