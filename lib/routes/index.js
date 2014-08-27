var express = require('express')

var auth = require('./auth')
var demo = require('./demo')
var item = require('./item')
var game = require('./game')

var router = express.Router()

router.use('/api', auth)
router.use('/api', item)
router.use('/api', game)
router.use('/demo', demo)

module.exports = router
