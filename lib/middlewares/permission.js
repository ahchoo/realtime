var _ = require('underscore')
var models = require('../models')

module.exports = function (permissions) {
  return function (req, res, next) {
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
      var path = req.path
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
          },
          path: path,
          method: method
        }).exec()
      }).then(function (privileges) {
        if (privileges.length) {
          next()
        } else {
          next(new Error('No Access control permissions.'))
        }
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
