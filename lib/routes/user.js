var express = require('express')
var models = require('../models')

var router = express.Router()

router
  .route('/users')

  .post(function (req, res, next) {
    models.User.create(req.body).then(function (user) {
      res.json({data: user.info()})
    }, next)
  })

module.exports = router
