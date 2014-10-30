var express = require('express')
var router = express.Router()
var models = require('../../models')

router.use('/', function (req, res) {
  var gameId = req.param('gameId')
  console.log('gameId in app qrcode', gameId)
  console.log(req.param.gameId)
  models.Game
  .findById(gameId)
  .populate('item')
  .exec()
  .then(function (game) {
    res.render('app/qrcode',{
      game: game
    })
  })
})

module.exports = router
