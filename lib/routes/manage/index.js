var express = require('express')
var router = express.Router()
//var permission = require('../../middlewares/permission')

router
  //.use(permission())
  .use('/users', require('./users'))
  .use('/login', require('./login'))
  .use('/items', require('./items'))
  .use('/roles', require('./roles'))
  .use('/privileges', require('./privileges'))
  .use('/games', require('./games'))
  .get('/', function (req, res) {
    res.render('manage/index', {
      title: 'Index'
    })
  })

module.exports = router  
