var express = require('express')
var _ = require('underscore')
var models = require('../models')

var router = express.Router()

router
  .route('/auth')

  .post(function (req, res) {

    var data = req.body

    if (data.username) {

      models.User.findOne({username: data.username}, function (err, user) {
        if (user.password === data.password) {
          res.json({error: null, data: _.pick(user, 'username', 'token')})
        } else {
          res.json({error: {msg: 'Unmatched user name and password'}})
        }
      })

    } else {
      res.json({error: {msg: 'No username provided'}})
    }

  })

module.exports = router
