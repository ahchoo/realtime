var _ = require('underscore')

module.exports = function (permissions) {
  return function (req, res, next) {
    allowed = permissions[req.method.toLowerCase()]
    if (alowed === undefined) {
      next(new Error('Missing method permissions'))
    } else if (_.contains(allowed, getUserRole(req))) {
      next()
    } else {
      next(new Error('No Access control permissions'))
    }
  }
}

var getUserRole = function(req){
  if ('user' in req.session) {
    user = req.session.user
    if (user.isAdmin) {
      return 'admin'
    } else {
      return 'player'
    }
  } else {
    return 'guest'
  }
}
