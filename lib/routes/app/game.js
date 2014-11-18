var express = require('express')
var router = express.Router()
var models = require('../../models')
var arena = require('../../socket/arena')

router
  .use(require('../../middlewares/login-check')())
  .get('/:gameId', function (req, res) {
    models.Game
      .findById(req.params.gameId)
      .populate('item')
      .exec()
      .then(function (game) {
        var instance = arena.game(req.params.gameId)

        if (instance && instance.status === 'started') {
          res.redirect('/')
        } else {
          res.render('app/game', {
            game: game,
            item: game.item,
            user: req.user
          })
        }
      })
  })

module.exports = router
