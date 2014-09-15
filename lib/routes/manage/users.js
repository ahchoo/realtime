var express = require('express')
var router = express.Router()
var models = require('../../models')

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
  .post(function (req, res, next) {
    // TODO
    next()
  })

router
  .route('/:userId')
  .get(function (req, res, next) {
    var userId = req.param('userId')
    if (userId === 'new') {
      res.render('manage/user', {
        title: 'Create User',
        user: {
          email: '',
          name: ''
        }
      })
    } else {
      models.User.findById(userId, function (err, user) {
        if (user) {
          res.render('manage/user', {
            title: 'Update User',
            user: user
          })
        } else {
          next(new Error('Invalid user id: ' + userId))
        }
      })
    }
  })
  .post(function (req, res) {
    console.log(req.body)
    res.redirect('/manage/users')
  })
  .delete(function (req, res, next) {
    // TODO
    next()
  })

module.exports = router  
