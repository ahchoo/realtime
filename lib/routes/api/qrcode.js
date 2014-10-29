var express = require('express')
var models = require('../../models')
var permission = require('../../middlewares/permission')

var router = express.Router()

router
  .route('/')
  .get(function (req, res, next) {
    console.log('get qrcode')
    var body = req.body
    var gameId = req.params[gameId]

    if (gameId) {
      models.User.findOne(user, function (err, user) {
        if (user) {
          //res.json({data:user.info()})
          // redirect to game room
          res.redirect('/games/' + gameId)
        } else {
          // create a new user
          res.body.gameId = gameId
          res.redirect('/qrcode/new_user')
        }
      })
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
