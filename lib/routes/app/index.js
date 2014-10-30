var express = require('express')
var router = express.Router()

router.use('/login', require('./login'))
router.use('/signup', require('./signup'))
router.use('/games', require('./game'))
router.use('/qrcode', require('./qrcode'))

// should be at last
router.use('/', require('./game-list'))

module.exports = router
