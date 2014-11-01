var express = require('express')
var router = express.Router()
var models = require('../../models')
var md5 = require('MD5')
var _ = require('underscore')
var async = require('async')

router
  .route('/')
  .get(function (req, res) {
    models.Game.find(function (err, games) {
      res.render('manage/games', {
        games: games
      })
    })
  })

module.exports = router
