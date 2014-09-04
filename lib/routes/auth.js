var express = require('express')
var _ = require('underscore')
var models = require('../models')
var permission = require('../middlewares/permission')

var router = express.Router()

router
  .route('/auth')
  .all(permission({post: ['guest']}))
  .post(function (req, res, next) {
    var body = req.body

    models.User.findOne({
      username: body.username,
      password: body.password
    }, function (err, user) {
      if (err) {
        next(err)
        return
      }

      if (user) {
        res.json({data: _.pick(user, 'username', 'token')})
        req.session.user = user
      } else {
        next(new Error('Unmatched username and password'))
      }
    })

  })

module.exports = router
