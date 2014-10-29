var express = require('express')

var router = express.Router()

router.use('/db', require('./db'))
router.use('/auth', require('./auth'))
router.use('/items', require('./item'))
router.use('/games', require('./game'))
router.use('/users', require('./user'))
router.use('/qrcode', require('./qrcode'))

module.exports = router
