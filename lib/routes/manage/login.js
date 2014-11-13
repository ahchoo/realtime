var express = require('express')
var router = express.Router()
var models = require('../../models')
//var md5 = require('MD5')
//var _ = require('underscore')
//var async = require('async')

router
  .route('/')
  .get(function (req, res) {
    res.render('manage/login')
  })
  .post(function (req, res) {
    var body = req.body
    console.log(body)
    models.User.findOne({
      email: body.email,
      password: body.password
    }, function (err, user) {
      if (err || !user || !user.isAdmin) {
        res.render('/manage/login')
      } else {
        res.render('/manage/index', {data: user.info()})
        req.session.user = user
      }
    })
  })

router
module.exports = router  
