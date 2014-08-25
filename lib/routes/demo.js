var models = require('../models')
var express = require('express')

var router = express.Router()

router.get('/', function (req, res) {
  res.render('index', {
    username: req.session.username
  })
})
router.get('/demo-socket', function (req, res) {
  res.render('demo-socket', {
    username: req.session.username
  })
})
router.get('/demo-items', function (req, res) {
  models.Item.find(function (err, items) {

    res.render('demo-items', {
      username: req.session.username,
      items: items
    })

  })
})
router.get('/demo-item/:itemId', function (req, res) {
  models.Item.findById(req.param('itemId'), function (err, item) {
    res.render('demo-item', {
      username: req.session.username,
      item: item
    })

  })
})

router.get('/demo-games', function (req, res) {
  models.Item.find(function (err, items) {
    models.Game.find(function (err, games) {
      res.render('demo-games', {
        username: req.session.username,
        games: games,
        items: items
      })
    })
  })
})

router.get('/demo-game', function (req, res) {
  models.Item.find(function (err, items) {
    res.render('demo-game', {
      items: items
    })
  })
})

router.get('/demo-game/:gameId', function (req, res) {
  models.Game.findById(req.param('gameId'), function (err, game) {
    res.render('demo-game', {
      game: game
    })
  })
})

router.post('/demo-game', function (req, res) {
  new models.Game({
    itemId: req.body.itemId,
    capacity: parseInt(req.body.capacity, 10) || 10,
    status: 'inited',
    countdown: parseInt(req.body.countdown, 10) || 10
  }).save(function () {
    res.redirect('/demo/demo-games')
  })
})

router.post('/auth/login', function (req, res) {
  req.session.username = req.param('username')
  res.redirect('/demo')
})

module.exports = router
