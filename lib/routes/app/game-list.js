var express = require('express')
var router = express.Router()
var models = require('../../models')

router.use('/', function (req, res) {
  models.Game.find({}).populate('item').exec().then(function (games) {
    res.render('app/index', {games: games})
  })
})

module.exports = router
