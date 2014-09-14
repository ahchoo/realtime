var cookie = require('cookie-cutter')

var router = require('../lib/router')
var Ctrl = require('../lib/ctrl')

router
  .use('/', function () {
    new Ctrl({
      view: '/views/games.html',
      ctrl: require('./games')
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
  .use('/reset', function () {
    new Ctrl({
      view: '/views/reset.html',
      ctrl: require('./reset')
    }).activate()
  })
  .use('/signup', function () {
    new Ctrl({
      view: '/views/signup.html',
      ctrl: require('./signup')
    }).activate()
  })
  .use('/admin-game/:gameId', function () {
    new Ctrl({
      view: '/views/admin-game.html',
      ctrl: require('./admin-game')
    }).activate()
  })

router.on('before change', function (url, params, prevent) {
  if (url !== '/login' && url !== '/signup' && !cookie.get('ahchoo_token')) {
    router.goto('/login')

    prevent()
  }
})
