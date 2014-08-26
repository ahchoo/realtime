var express = require('express')
var models = require('../models')

var router = express.Router()

router
  .route('/games')
  .get(function (req, res) {
    models.Game.find().populate('item').exec(function (err, games) {
      res.json({
        data: games
      })
    })
  })
  .post(function (req, res, next) {
    models.Game.create(req.body).then(function (game) {
      models.Game.findById(game._id).populate('item').exec(function (err, g) {
        if (err) {
          next(err)
        } else {
          res.json({
            data: g
          })
        }
      })
    }, next)
  })

router
  .route('/games/:gameId')
  .get(function (req, res, next) {
    models.Game.findById(req.param('gameId')).populate('item').exec(function (err, game) {
      if (err) {
        next(err)
      } else {
        res.json({
          data: game
        })
      }
    })
  })
  .delete(function (req, res, next) {
    models.Game.findByIdAndRemove(req.param('gameId')).populate('item').exec(function (err, game) {
      if (err) {
        next(err)
      } else {
        res.json({
          data: game
        })
      }
    })
  })

module.exports = router
