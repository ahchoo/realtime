var express = require('express')
var _ = require('underscore')
var models = require('../models')

var router = express.Router()

router
  .route('/auth')

  .post(function (req, res) {

    var username = req.body.username

    if (username) {

      models.User.find({username: username}, function (err, user) {
        res.json({error: null, data: _.pick(user, 'username', 'token')})
      })

    } else {
      res.json({error: {msg: 'Authentication failed'}})
    }

  })

module.exports = router
