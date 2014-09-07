var router = require('../lib/router')
var Ctrl = require('../lib/ctrl')

router
  .use('/', function () {
    new Ctrl({
      view: '/views/login.html',
      ctrl: require('./login')
    }).activate()
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
    }).activate()
  })
  .use('/games/:gameId', function () {
    new Ctrl({
      view: '/views/game.html',
      ctrl: require('./game')
    }).activate()
  })
