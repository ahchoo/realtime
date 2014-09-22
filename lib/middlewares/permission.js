var _ = require('underscore')
var models = require('../models')
var async = require('async')

var checkPermission = function (path, method, user, callback) {
  var tasks = []
  tasks.push(function (callback) {
    models.Role.findByUser(user, callback)
  })
  tasks.push(function (roles, callback) {
    //console.log('roles', roles)
    models.PrivilegeInRole.find({
      role: {
        $in: _.map(roles, function (role) { return role._id })
      }
    }).populate('privilege').exec(callback)
  })
  tasks.push(function (privilegeInRoles, callback) {
    //console.log('privilegeInRoles', privilegeInRoles)
    var privilegeIds = _.map(privilegeInRoles, function (privilegeInRole) { return privilegeInRole.privilege })
    models.Privilege.find({
      _id: {
        $in: privilegeIds,
      }
    }).exec(callback)
  })
  tasks.push(function (privileges, callback) {
    //console.log('privileges', privileges)
    for (var i = 0, length = privileges.length; i < length; i++) {
      var privilege = privileges[i]
      if (new RegExp(privilege.path).exec(path) &&
        new RegExp(privilege.method).exec(method)) {
        return callback()
      }
    }
    models.Privilege.find(function (err, privileges) {
      //console.log(err)
      //console.log(privileges)
      if (err) {
        callback(err)
      } else if (!privileges || !privileges.length) {
        callback()
      } else {
        var exsits = false
        _.each(privileges, function (privilege) {
          //console.log(privilege.path, path)
          //console.log(privilege.method, method)
          if (new RegExp(privilege.path).exec(path) &&
            new RegExp(privilege.method).exec(method)) {
            exsits = true
          }
        })
        if (exsits) {
          callback(new Error('No Access control permissions.'))
        } else {
          callback()
        }
      }
    })
  })

  async.waterfall(tasks, callback)
}

module.exports = function (permissions) {
  return function (req, res, next) {
    return next()

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
      checkPermission(path, method, user, next)
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

module.exports.checkPermission = checkPermission
