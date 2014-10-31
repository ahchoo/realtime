var cookie = require('cookie-cutter')
var location = require('global/window').location

cookie.set('ahchoo_token', '')

location.href = '/login'
