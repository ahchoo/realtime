var express = require('express')
var router = express.Router()
var models = require('../../models')
var _ = require('underscore')

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
  .get(function (req, res, next) {
    models.User.find(function (err, users) {
      if (err) {
        return next(err)
      }

      var roleId = req.param('roleId')
      if (roleId === 'new') {
        res.render('manage/role', {
          title: 'Create Role',
          role: {
            name: '',
            description: ''
          },
          users: users
        })
      } else {
        models.UserInRole.find({
          role: roleId
        }, function (err, userInRoles) {
          var userIds = _.map(userInRoles, function (userInRole) { return userInRole.user.toString() })
          _.each(users, function (user) {
            if (userIds.indexOf(user._id.toString()) >= 0) {
              user.selected = 'selected'
            }
          })
          models.Role.findById(roleId, function (err, role) {
            if (err) {
              return next(err)
            }
            res.render('manage/role', {
              title: 'Update Role',
              role: role,
              users: users
            })
          })
        })
      }
    })
  })
  .post(function (req, res, next) {
    models.User.find(function (err, users) {
      var name = req.body.name
      var description = req.body.description || ''
      var errors = []
      var selectedUserIds = req.body.users || []

      if (!(selectedUserIds instanceof Array)) selectedUserIds = [selectedUserIds]

      if (err) {
        return next(err)
      }

      var roleId = req.param('roleId')
      if (roleId === 'new') {
        if (!name) errors.push('Name is required')

        if (errors.length) {
          res.render('manage/role', {
            title: 'Create Role',
            role: {
              name: name,
              description: description
            },
            errors: errors,
            users: users
          })
        } else {
          models.Role.create({
            name: name,
            description: description
          }, function (err, role) {
            if (err) {
              return next(err)
            }
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
              title: 'Create Role',
              role: role,
              infoes: ['Role created...'],
              users: users
            })
          })
        }
      } else {
        // TODO
      }
    })
  })

module.exports = router
    
