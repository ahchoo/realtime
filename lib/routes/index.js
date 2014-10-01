var express = require('express')

var router = express.Router()

router.use('/api', require('./api'))
router.use('/manage', require('./manage'))
router.use('/', require('./app'))

module.exports = router
