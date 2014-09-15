var express = require('express')
var router = express.Router()
var models = require('../../models')
var md5 = require('MD5')
var _ = require('underscore')

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
  .get(function (req, res, next) {
    models.Role.find(function (err, roles) {
      if (err) {
        return next(err)
      }

      var userId = req.param('userId')
      if (userId === 'new') {
        res.render('manage/user', {
          title: 'Create User',
          user: {
            email: '',
            name: ''
          },
          roles: roles
        })
      } else {
        models.UserInRole.find({
          user: userId
        }, function (err, userInRoles) {
          var roleIds = _.map(userInRoles, function (userInRole) { return userInRole.role.toString() })
          _.each(roles, function (role) {
            if (roleIds.indexOf(role._id.toString()) >= 0) {
              role.selected = 'selected'
            }
          })
          models.User.findById(userId, function (err, user) {
            if (user) {
              res.render('manage/user', {
                title: 'Update User',
                user: user,
                roles: roles
              })
            } else {
              next(new Error('Invalid user id: ' + userId))
            }
          })
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

    models.Role.find(function (err, roles) {
      if (_id) {
        // Update
      } else {
        // Create
        if (!email) errors.push('Email is required')
        if (!name) errors.push('Name is required')
        if (!password) errors.push('Password is required')
        if (!password2) errors.push('Password confirm is required')
        if (password && password2 && password !== password2) errors.push('Password is not match')

        if (errors.length) {
          res.render('manage/user', {
            title: 'Create User',
            user: {
              email: email,
              name: name
            },
            errors: errors,
            roles: roles
          })
        } else {
          models.User.create({
            email: email,
            name: name,
            password: md5(password)
          }, function (err, user) {
            if (err) {
              return res.render('manage/user', {
                title: 'Create User',
                user: {
                  email: email,
                  name: name
                },
                errors: [err.message],
                roles: roles
              })
            }
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
          })
        }
      }
    })
  })

// TODO html form not support delete method
router
  .route('/:userId/delete')
  .post(function (req, res, next) {
    var _id = req.body._id
    if (!_id) return next(new Error('Id is required'))

    models.Role.find(function (err, roles) {
      models.User.findByIdAndRemove(_id).exec(function (err, user) {
        if (err) {
          next(err)
        } else {
          models.UserInRole.remove({
            user: _id
          }, function () {
            res.set('Refresh', '2; url=/manage/users')
            res.render('manage/user', {
              title: 'Upadte User',
              user: user,
              infoes: ['This user is removed...'],
              roles: roles
            })
          })
        }
      })
    })
  })

module.exports = router  
