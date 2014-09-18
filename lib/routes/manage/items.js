var express = require('express')
var router = express.Router()
var models = require('../../models')

router
  .route('/')
  .get(function (req, res) {
    models.Item.find(function (err, items) {
      res.render('manage/items', {
        title: 'Items',
        items: items
      })
    })
  })

module.exports = router
