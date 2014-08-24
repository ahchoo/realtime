var express = require('express')
var models = require('../models')

var router = express.Router()

router
  .route('/items')
  .get(function (req, res) {

    models.Item.find(function (err, items) {

      res.json({
        error: null,
        data: items
      })

    })

  })
  .post(function (req, res) {

    models.Item.create(req.body)
      .then(function resolve(item) {
        res.json({
          error: null,
          data: item
        })
      }, function error(err) {
        res.json({
          error: err
        })
      })

  })

router
  .route('/items/:itemId')
  .get(function (req, res) {
    models.Item.findById(req.param('itemId'), function (err, item) {

      if (err) {
        res.json({
          error: err
        })
      } else {
        res.json({
          error: null,
          data: item
        })
      }

    })
  })
  .delete(function (req, res) {
    models.Item.findByIdAndRemove(req.param('itemId'), function (err, item) {

      if (err) {
        res.json({error: err})
      } else {
        res.json({
          error: null,
          data: item
        })
      }

    })
  })

module.exports = router
