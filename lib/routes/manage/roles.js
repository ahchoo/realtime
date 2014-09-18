var express = require('express')
var router = express.Router()
var models = require('../../models')
var _ = require('underscore')
var async = require('async')

router
  .route('/')
  .get(function (req, res, next) {
    models.Role.find(function (err, roles) {
      if (err) {
        next(err)
      } else {
        res.render('manage/roles', {
          title: 'Roles',
          roles: roles
        })
      }
    })
  })

router
  .route('/:roleId')
  .get(function (req, res) {
    var roleId = req.param('roleId')
    var title = roleId === 'new' ? 'Create Role' : 'Update Role'
    var tasks = []

    tasks.push(function (callback) {
      models.User.find(callback)
    })
    tasks.push(function (users, callback) {
      models.Privilege.find(function (err, privileges) {
        callback(err, users, privileges)
      })
    })
    if (roleId === 'new') {
      tasks.push(function (users, privileges, callback) {
        res.render('manage/role', {
          title: title,
          role: {
            name: '',
            description: ''
          },
          users: users,
          privileges: privileges
        })
        callback()
      })
    } else {
      tasks.push(function (users, privileges, callback) {
        models.UserInRole.find({
          role: roleId
        }, function (err, userInRoles) {
          callback(err, users, privileges, userInRoles)
        })
      })
      tasks.push(function (users, privileges, userInRoles, callback) {
        var userIds = _.map(userInRoles, function (userInRole) {
          return userInRole.user.toString()
        })
        _.each(users, function (user) {
          if (_.contains(userIds, user._id.toString())) {
            user.selected = 'checked'
          }
        })
        models.PrivilegeInRole.find({
          role: roleId
        }, function (err, privilegeInRoles) {
          callback(err, users, privileges, privilegeInRoles)
        })
      })
      tasks.push(function (users, privileges, privilegeInRoles, callback) {
        var privilegeIds = _.map(privilegeInRoles, function (privilegeInRole) {
          return privilegeInRole.privilege.toString()
        })
        _.each(privileges, function (privilege) {
          if (_.contains(privilegeIds, privilege._id.toString())) {
            privilege.selected = true
          }
        })
        models.Role.findById(roleId, function (err, role) {
          if (!role) {
            err = new Error('Invalid role Id: ' + roleId)
          }
          callback(err, users, privileges, role)
        })
      })
      tasks.push(function (users, privileges, role, callback) {
        res.render('manage/role', {
          title: title,
          role: role,
          users: users,
          privileges: privileges
        })
        callback()
      })
    }

    async.waterfall(tasks, function (err, users, privileges, role) {
      if (err) {
        res.render('manage/role', {
          title: title,
          role: role || {},
          users: users || [],
          privileges: privileges || [],
          errors: err instanceof Array ? err : [err]
        })
      }
    })
  })
  .post(function (req, res) {
    var name = req.body.name
    var description = req.body.description || ''
    var errors = []
    var selectedUserIds = req.body.users || []
    var selectedPrivilegeIds = req.body.privileges || []
    var roleId = req.param('roleId')
    var title = roleId === 'new' ? 'Create Role' : 'Update Role'

    if (!(selectedUserIds instanceof Array)) selectedUserIds = [selectedUserIds]
    if (!(selectedPrivilegeIds instanceof Array)) selectedPrivilegeIds = [selectedPrivilegeIds]

    var tasks = []

    tasks.push(function (callback) {
      models.User.find(callback)
    })
    tasks.push(function (users, callback) {
      models.Privilege.find(function (err, privileges) {
        callback(err, users, privileges)
      })
    })

    if (roleId === 'new') {
      tasks.push(function (users, privileges, callback) {
        if (!name) errors.push('Name is required')

        if (errors.length) {
          callback(errors, users, privileges, {
            name: name,
            description: description
          })
        } else {
          models.Role.create({
            name: name,
            description: description
          }, function (err, role) {
            callback(err, users, privileges, role)
          })
        }
      })
      tasks.push(function (users, privileges, role, callback) {
        if (selectedUserIds.length) {
          var documents = _.map(selectedUserIds, function (userId) {
            return {
              user: userId,
              role: role._id
            }
          })
          models.UserInRole.create(documents)
        }
        if (selectedPrivilegeIds.length) {
          var documents2 = _.map(selectedPrivilegeIds, function (privilegeId) {
            return {
              privilege: privilegeId,
              role: role._id
            }
          })
          models.PrivilegeInRole.create(documents2)
        }
        res.set('Refresh', '2; url=/manage/roles')
        res.render('manage/role', {
          title: title,
          role: role,
          infoes: ['Role created...'],
          users: users,
          privileges: privileges
        })
        callback()
      })
    } else {
      // TODO update
      tasks.push(function (users, privileges, callback) {
        res.redirect('/manage/roles')
        callback()
      })
    }

    async.waterfall(tasks, function (err, users, privileges, role) {
      if (err) {
        res.render('manage/role', {
          title: title,
          role: role || {},
          errors: err instanceof Array ? err : [err],
          users: users || [],
          privileges: privileges
        })
      }
    })
  })

router
  .route('/:roleId/delete')
  .post(function (req, res) {
    var roleId = req.param('roleId')
    var tasks = []

    tasks.push(function (callback) {
      models.User.find(callback)
    })
    tasks.push(function (users, callback) {
      models.Privilege.find(function (err, privileges) {
        callback(err, users, privileges)
      })
    })
    tasks.push(function (users, privileges, callback) {
      if (!roleId) {
        callback(new Error('ID is required'), users, privileges, {
          name: '',
          description: ''
        })
      } else {
        models.Role.findByIdAndRemove(roleId, function (err, role) {
          callback(err, users, privileges, role)
        })
      }
    })
    tasks.push(function (users, privileges, role, callback) {
      models.UserInRole.remove({
        role: roleId
      }, function (err) {
        callback(err, users, privileges, role)
      })
    })
    tasks.push(function (users, privileges, role, callback) {
      models.PrivilegeInRole.remove({
        role: roleId
      }, function (err) {
        callback(err, users, privileges, role)
      })
    })
    tasks.push(function (users, privileges, role, callback) {
      res.set('Refresh', '2; url=/manage/roles')
      res.render('manage/role', {
        title: 'Update Role',
        role: role,
        infoes: ['This role has been removed...'],
        users: users,
        privileges: privileges
      })
      callback()
    })

    async.waterfall(tasks, function (err, users, privileges, role) {
      if (err) {
        res.render('manage/role', {
          title: 'Update Role',
          role: role || {},
          errors: err instanceof Array ? err : [err],
          users: users || [],
          privileges: privileges || []
        })
      }
    })
  })

module.exports = router
