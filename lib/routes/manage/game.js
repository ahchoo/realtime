var express = require('express')
var router = express.Router()
var models = require('../../models')
var md5 = require('MD5')
var _ = require('underscore')
var async = require('async')

router
  .route('/')
  .get(function (req, res) {
    models.Item.find(function (err, items) {
      res.render('manage/test_game', {
        items: items
      })
    })
  })

module.exports = router
