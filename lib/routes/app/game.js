var express = require('express')
var router = express.Router()
var models = require('../../models')

router.get('/:gameId', function (req, res) {
  models.Game
    .findById(req.params.gameId)
    .populate('item')
    .exec()
    .then(function (game) {
      res.render('app/game', {
        game: game,
        item: game.item
      })
    })
})

module.exports = router
