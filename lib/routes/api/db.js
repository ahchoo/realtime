var express = require('express')

var initdb = require('../../../fixture')

var router = express.Router()

router
  .route('/reset')

  .post(function (req, res) {

    initdb().then(function () {
      res.json({data: true})
    })

  })

module.exports = router
