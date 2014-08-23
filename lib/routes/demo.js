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
  console.log(req.param('itemId'));
  models.Item.findById(req.param('itemId'), function (err, item) {

    console.log(item);

    res.render('demo-item', {
      username: req.session.username,
      item: item
    })

  })
})

router.post('/auth/login', function (req, res) {
  req.session.username = req.param('username')
  res.redirect('/')
})

module.exports = router
