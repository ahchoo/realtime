var _ = require('underscore')
var models = require('../models')

module.exports = function (permissions) {
  return function (req, res, next) {
    if (process.env.NODE_ENV === 'testing') {
      next()
      return
    }

    if (permissions) {
      var allowed = permissions[req.method.toLowerCase()]
      if (allowed === undefined) {
        next(new Error('Missing method permissions'))
      } else if (_.contains(allowed, getUserRole(req))) {
        next()
      } else {
        next(new Error('No Access control permissions'))
      }
    } else {
      var path = req.baseUrl + req.path
      var method = req.method.toLowerCase()

      var user = req.session.user
      models.Role.findByUser(user).then(function (roles) {
        return models.PrivilegeInRole.find({
          role: {
            $in: _.map(roles, function (role) { return role._id })
          }
        }).populate('privilege').exec()
      }).then(function (privilegeInRoles) {
        var privilegeIds = _.map(privilegeInRoles, function (privilegeInRole) { return privilegeInRole.privilege })
        
        return models.Privilege.find({
          _id: {
            $in: privilegeIds,
          }
        }).exec()
      }).then(function (privileges) {
        for (var i = 0, length = privileges.length; i < length; i++) {
          var privilege = privileges[i]
          if (new RegExp(privilege.path).exec(path) &&
            new RegExp(privilege.method).exec(method)) {
            return next()
          }
        }
        next(new Error('No Access control permissions.'))
      })
    }
  }
}

var getUserRole = function(req){
  var user = req.session.user
  if (user !== undefined) {
    if (user.isAdmin) {
      return 'admin'
    } else {
      return 'player'
    }
  } else {
    return 'guest'
  }
}
