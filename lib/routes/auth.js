var express = require('express')
var models = require('../models')
var permission = require('../middlewares/permission')

var router = express.Router()

router
  .route('/auth')
  .all(permission())
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
        res.json({data: user.info()})
        req.session.user = user
      } else {
        next(new Error('Unmatched email and password'))
      }
    })

  })

module.exports = router
