var express = require('express')
var _ = require('underscore')
var models = require('../models')

var router = express.Router()

router
  .route('/auth')

  .post(function (req, res, next) {

    var data = req.body

    if (data.username) {

      models.User.findOne({username: data.username}, function (err, user) {
        if (user.password === data.password) {
          res.json({data: _.pick(user, 'username', 'token')})
        } else {
          next(new Error('Unmatched user name and password'))
        }
      })

    } else {
      next(new Error('No username provided'))
    }

  })

module.exports = router
