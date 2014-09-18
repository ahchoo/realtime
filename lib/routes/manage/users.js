var express = require('express')
var router = express.Router()
var models = require('../../models')
var md5 = require('MD5')
var _ = require('underscore')
var async = require('async')

router
  .route('/')
  .get(function (req, res) {
    models.User.find(function (err, users) {
      res.render('manage/users', {
        title: 'Users',
        users: users
      })
    })
  })

router
  .route('/:userId')
  .get(function (req, res) {
    var userId = req.param('userId')
    var title = userId === 'new' ? 'Create User' : 'Update User'
    
    var tasks = []
    tasks.push(function (callback) {
      models.Role.find(callback)
    })
    if (userId === 'new') {
      tasks.push(function (roles, callback) {
        res.render('manage/user', {
          title: title,
          user: {
            email: '',
            name: ''
          },
          roles: roles
        })
        callback()
      })
    } else {
      tasks.push(function (roles, callback) {
        models.UserInRole.find({
          user: userId
        }, function (err, userInRoles) {
          callback(err, roles, userInRoles)
        })
      })
      tasks.push(function (roles, userInRoles, callback) {
        var roleIds = _.map(userInRoles, function (userInRole) { return userInRole.role.toString() })
        _.each(roles, function (role) {
          if (roleIds.indexOf(role._id.toString()) >= 0) {
            role.selected = 'checked'
          }
        })
        models.User.findById(userId, function (err, user) {
          if (!user) {
            err = new Error('Invalid user id: ' + userId)
          }
          callback(err, roles, user)
        })
      })
      tasks.push(function (roles, user, callback) {
        res.render('manage/user', {
          title: title,
          user: user,
          roles: roles
        })
        callback()
      })
    }
    async.waterfall(tasks, function (err, roles, user) {
      if (err) {
        res.render('manage/user', {
          title: title,
          user: user || {},
          roles: roles || []
        })
      }
    })
  })
  .post(function (req, res) {
    var email = req.body.email
    var name = req.body.name
    var password = req.body.password
    var password2 = req.body.password2
    var _id = req.body._id
    var selectedRoles = req.body.roles || []

    if (!(selectedRoles instanceof Array)) selectedRoles = [selectedRoles]

    var errors = []
    var tasks = []

    tasks.push(function (callback) {
      models.Role.find(callback)
    });
    if (_id) {
      // TODO update
      tasks.push(function (roles, callback) {
        res.redirect('/manage/users')
        callback()
      })
    } else {
      // Create
      tasks.push(function (roles, callback) {
        if (!email) errors.push('Email is required')
        if (!name) errors.push('Name is required')
        if (!password) errors.push('Password is required')
        if (!password2) errors.push('Password confirm is required')
        if (password && password2 && password !== password2) errors.push('Password is not match')

        if (errors.length) {
          callback(errors, roles)
        } else {
          models.User.create({
            email: email,
            name: name,
            password: md5(password)
          }, function (err, user) {
            callback(err, roles, user)
          })
        }
      })
      tasks.push(function (roles, user, callback) {
        if (selectedRoles.length) {
          var documents = _.map(selectedRoles, function (role) {
            return {
              user: user._id,
              role: role
            }
          })
          models.UserInRole.create(documents)
        }
        res.set('Refresh', '2; url=/manage/users')
        res.render('manage/user', {
          title: 'Create User',
          user: user,
          roles: roles,
          infoes: ['User Created...']
        })
        callback()
      })
    }
    async.waterfall(tasks, function (err, roles) {
      if (!err) return
      res.render('manage/user', {
        title: 'Create User',
        user: {
          name: name,
          email: email
        },
        errors: err instanceof Array ? err : [err],
        roles: roles
      })
    })
  })

// TODO html form not support delete method
router
  .route('/:userId/delete')
  .post(function (req, res) {
    var _id = req.body._id
    var tasks = []

    tasks.push(function (callback) {
      models.Role.find(callback)
    })
    tasks.push(function (roles, callback) {
      if (!_id) {
        callback(new Error('ID is required'), roles, {
          email: '',
          name: ''
        })
      } else {
        models.User.findByIdAndRemove(_id, function (err, user) {
          callback(err, roles, user)
        })
      }
    })
    tasks.push(function (roles, user, callback) {
      models.UserInRole.remove({
        user: _id
      }, function (err) {
        callback(err, roles, user)
      })
    })
    tasks.push(function (roles, user, callback) {
      res.set('Refresh', '2; url=/manage/users')
      res.render('manage/user', {
        title: 'Update User',
        user: user,
        infoes: ['This user has been removed...'],
        roles: roles
      })
      callback()
    })

    async.waterfall(tasks, function (err, roles, user) {
      if (err) {
        res.render('manage/user', {
          title: 'Update User',
          user: user || {},
          errors: err instanceof Array ? err : [err],
          roles: roles || []
        })
      }
    })
  })

module.exports = router  
