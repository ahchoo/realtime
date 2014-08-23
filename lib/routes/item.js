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

module.exports = router
