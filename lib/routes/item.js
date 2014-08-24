var express = require('express')
var models = require('../models')

var router = express.Router()

router
  .route('/items')
  .get(function (req, res) {

    models.Item.find(function (err, items) {
      res.json({data: items})
    })

  })
  .post(function (req, res, next) {

    models.Item.create(req.body)
      .then(function resolve(item) {
        res.json({data: item})
      }, next)

  })

router
  .route('/items/:itemId')
  .get(function (req, res, next) {
    models.Item.findById(req.param('itemId'), function (err, item) {

      if (err) {
        next(err)
      } else {
        res.json({data: item})
      }

    })
  })
  .delete(function (req, res, next) {
    models.Item.findByIdAndRemove(req.param('itemId'), function (err, item) {

      if (err) {
        next(err)
      } else {
        res.json({data: item})
      }

    })
  })

module.exports = router
