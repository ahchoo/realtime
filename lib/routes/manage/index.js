var express = require('express')
var router = express.Router()

router
  .use('/users', require('./users'))
  .use('/items', require('./items'))
  .get('/', function (req, res) {
    res.render('manage/index', {
      title: 'Index'
    })
  })

module.exports = router  
