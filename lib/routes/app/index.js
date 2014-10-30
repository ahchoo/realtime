var express = require('express')
var router = express.Router()

router.use('/login', require('./login'))
router.use('/signup', require('./signup'))
router.use('/games', require('./game'))
router.use('/', require('./game-list'))
router.use('/qrcode', require('./qrcode'))

module.exports = router
