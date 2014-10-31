var express = require('express')
var router = express.Router()
var models = require('../../models')

router
  .use(require('../../middlewares/login-check')())
  .get('/:gameId', function (req, res) {
  models.Game
    .findById(req.params.gameId)
    .populate('item')
    .exec()
    .then(function (game) {
      res.render('app/game', {
        game: game,
        item: game.item,
        user: req.user
      })
    })
})

module.exports = router
