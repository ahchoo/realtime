var express = require('express')

var router = express.Router()

router.use('/api', require('./auth'))
router.use('/api', require('./item'))
router.use('/api', require('./user'))
router.use('/api', require('./game'))
router.use('/api', require('./db'))
router.use('/api', require('./user'))
router.use('/demo', require('./demo'))

module.exports = router
