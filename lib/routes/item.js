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

module.exports = router
