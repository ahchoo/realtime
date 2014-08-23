var express = require('express')
var _ = require('underscore')
var models = require('../models')

var router = express.Router()

router
  .route('/auth')

  .post(function (req, res, next) {

    var username = req.body.username

    if (username) {
      var user = models.User.find({username: username})

      res.json({error: null, data: _.pick(user, 'username', 'token')})
    } else {
      res.json({error: {msg: 'Authentication failed'}})
    }

  })

module.exports = router
