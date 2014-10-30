var express = require('express')
var models = require('../../models')

var router = express.Router()

router
  .route('/')
  .get(function (req, res) {
    models.Game.find().populate('item').exec(function (err, games) {
      res.json({
        data: games
      })
    })
  })
  .post(function (req, res, next) {
    models.Game.create(req.body).then(function (game) {
      models.Game.findById(game.id).populate('item').exec(function (err, g) {
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
  .route('/:id')
  .get(function (req, res, next) {
    models.Game.findById(req.param('id')).populate('item').exec(function (err, game) {
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
    models.Game.findByIdAndRemove(req.param('id')).populate('item').exec(function (err, game) {
      if (err) {
        next(err)
      } else {
        res.json({
          data: game
        })
      }
    })
  })

router
  .route('/:id/start')
  .get(function (req, res) {
    var arena = require('../../socket/arena')
    arena.game(req.params.id).start()

    res.json({data: true})
  })


module.exports = router
