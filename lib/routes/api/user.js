var express = require('express')
var models = require('../../models')
var permission = require('../../middlewares/permission')

var router = express.Router()

router
  .route('/')
  .all(permission())
  .post(function (req, res, next) {
    var email = req.body.email
    var name = req.body.name
    var password = req.body.password

    if (!email) return next(new Error('Email is required'))
    if (!name) return next(new Error('Name is required'))
    if (!password) return next(new Error('Password is required'))

    models.User.create({
      email: email,
      name: name,
      password: password
    }).then(function (user) {
      res.json({data: user.info()})
    }, next)
  })

module.exports = router
