var router = require('../lib/router')
var Ctrl = require('../lib/ctrl')

router.use('/', function () {
  new Ctrl({
    view: '/login/index.html',
    ctrl: require('./login')
  }).activate()
})
