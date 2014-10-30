var express = require('express')
var models = require('../../models')
var permission = require('../../middlewares/permission')

var router = express.Router()

router
  .route('/')
  .get(function (req, res, next) {
    var gameId = req.param('gameId') 
    var user = req.session.user

    if (gameId) {
      if (user) {
        res.redirect('/games/' + gameId)
      } else {
        res.redirect('/qrcode?gameId=' + gameId)
      }
    }
  })

router
  .route('/new_user')
  .post(function (req, res, next) {
    var gameId = req.body.gameId
    var name = req.body.name
    var password = 'ahchoo'

    if (!name) return next(new Error('Name is required'))
    if (!gameId) return next(new Error('Please Scan QRcode'))

    var email = name + '@ahchoo.qrcode'

    models.User.create({
      email: email,
      name: name,
      password: password
    }).then(function (user) {
      //res.json({
      //  data: user.info
      //})
      res.redirect('/games/' + gameId)
    })
  })

module.exports = router
