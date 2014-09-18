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
    if (roleId === 'new') {
      tasks.push(function (users, callback) {
        res.render('manage/role', {
          title: title,
          role: {
            name: '',
            description: ''
          },
          users: users
        })
        callback()
      })
    } else {
      tasks.push(function (users, callback) {
        models.UserInRole.find({
          role: roleId
        }, function (err, userInRoles) {
          callback(err, users, userInRoles)
        })
      })
      tasks.push(function (users, userInRoles, callback) {
        var userIds = _.map(userInRoles, function (userInRole) {
          return userInRole.user.toString()
        })
        _.each(users, function (user) {
          if (_.contains(userIds, user._id.toString())) {
            user.selected = 'checked'
          }
        })
        models.Role.findById(roleId, function (err, role) {
          if (!role) {
            err = new Error('Invalid role Id: ' + roleId)
          }
          callback(err, users, role)
        })
      })
      tasks.push(function (users, role, callback) {
        res.render('manage/role', {
          title: title,
          role: role,
          users: users
        })
        callback()
      })
    }

    async.waterfall(tasks, function (err, users, role) {
      if (err) {
        res.render('manage/role', {
          title: title,
          role: role || {},
          users: users || [],
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
    var roleId = req.param('roleId')
    var title = roleId === 'new' ? 'Create Role' : 'Update Role'

    if (!(selectedUserIds instanceof Array)) selectedUserIds = [selectedUserIds]

    var tasks = []

    tasks.push(function (callback) {
      models.User.find(callback)
    })

    if (roleId === 'new') {
      tasks.push(function (users, callback) {
        if (!name) errors.push('Name is required')

        if (errors.length) {
          callback(errors, users)
        } else {
          models.Role.create({
            name: name,
            description: description
          }, function (err, role) {
            callback(err, users, role)
          })
        }
      })
      tasks.push(function (users, role, callback) {
        if (selectedUserIds.length) {
          var documents = _.map(selectedUserIds, function (userId) {
            return {
              user: userId,
              role: role._id
            }
          })
          models.UserInRole.create(documents)
        }
        res.set('Refresh', '2; url=/manage/roles')
        res.render('manage/role', {
          title: title,
          role: role,
          infoes: ['Role created...'],
          users: users
        })
        callback()
      })
    } else {
      // TODO update
      tasks.push(function (users, callback) {
        res.redirect('/manage/roles')
        callback()
      })
    }

    async.waterfall(tasks, function (err, users, role) {
      if (err) {
        res.render('manage/role', {
          title: title,
          role: role || {},
          errors: err instanceof Array ? err : [err],
          users: users || []
        })
      }
    })
  })

module.exports = router
    
