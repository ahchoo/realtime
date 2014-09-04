var router = require('../lib/router')
var Ctrl = require('../lib/ctrl')

router
  .use('/', function () {
  })
  .use('/login', function () {
    new Ctrl({
      view: '/views/login.html',
      ctrl: require('./login')
    }).activate()
  })
  .use('/games', function () {
    new Ctrl({
      view: '/views/games.html',
      ctrl: require('./games')
    })
  })
