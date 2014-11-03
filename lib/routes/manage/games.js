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
    models.Game.findById(req.params.gameId)
    .populate('item').exec().then(function(game) {
      res.render('manage/game', {
        game: game
      })
    })
  })

module.exports = router
