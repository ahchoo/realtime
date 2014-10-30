var _s = require('underscore.string')
var models = require('../models')

module.exports = function () {
  return function (req, res, next) {
    var token = req.cookies.ahchoo_token

    if (token) {
      models.User.findOne({token: token}, function (err, user) {
        if (err) res.redirect('/login')

        next()
      })
    } else {
      res.redirect('/login')
    }
  }
}
