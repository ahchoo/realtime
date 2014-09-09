var express = require('express')
var models = require('../models')

var router = express.Router()

router
  .route('/auth')

  .post(function (req, res, next) {
    var body = req.body

    models.User.findOne({
      email: body.email,
      password: body.password
    }, function (err, user) {
      if (err) {
        next(err)
        return
      }

      if (user) {
        console.log(user.info())

        res.json({data: user.info()})
      } else {
        next(new Error('Unmatched email and password'))
      }
    })

  })

  .put(function (req, res, next) {
    var email = req.body.email
    var name = req.body.name
    var password = req.body.password

    // TODO simple validation...
    if (!email) return next(new Error('Email is required'))
    if (!name) return next(new Error('Name is required'))
    if (!password) return next(new Error('Password is required'))

    models.User.create({
      email: email,
      name: name,
      password: password
    }).then(function (user) {
      res.json({
        data: user.info()
      })
    }, next)
  })

module.exports = router
