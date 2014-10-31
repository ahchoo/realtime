/* jshint camelcase: false */

var models = require('../models')

module.exports = function () {
  return function (req, res, next) {
    var token = req.cookies.ahchoo_token

    if (token) {
      models.User.findOne({token: token}, function (err, user) {
        if (err || !user) {
          res.redirect('/login')
        } else {
          req.user = user
          return next()
        }
      })
    } else {
      res.redirect('/login')
    }
  }
}
