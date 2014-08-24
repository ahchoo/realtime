var _s = require('underscore.string')

module.exports = function () {
  return function (err, req, res, next) {
    if (_s.startsWith(req.url, '/api')) {
      res.json({error: {message: err.message}})
    } else {
      next(err)
    }
  }
}
