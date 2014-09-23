var express = require('express')
var router = express.Router()
var models = require('../../models')

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

module.exports = router
