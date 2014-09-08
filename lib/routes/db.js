var express = require('express')
var _ = require('underscore')

var initdb = require('../../fixture')

var router = express.Router()

router
  .route('/db/reset')

  .post(function (req, res, next) {

    initdb().then(function () {
      res.json({data: true})
    })

  })

module.exports = router
