var express = require('express')
var router = express.Router()
var models = require('../../models')

router
  .route('/')
  .get(function (req, res) {
    res.render('manage/login')
  })

module.exports = router  
