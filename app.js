var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var path = require('path')
var connect = require('connect')
var fs = require('fs')

var sessionStore = new connect.session.MemoryStore()

var env = require('./lib/env')

// do not connect to db in testing env
if (env.is.not.testing) {
  require('./lib/connect-db')()
}

var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cookieParser(env.SITE_SECRET))

app.use(expressSession({
  key: 'express.sid',
  store: sessionStore
}))

// templates
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, '/views'))

// serve static
app.use('/vendor', express.static(path.join(__dirname, '/public/vendor')))
app.use('/js', express.static(path.join(__dirname, '/public/js')))

// routes(api, manage, app)
app.use(require('./lib/routes'))

// error handling
app.use(require('./lib/middlewares/error-handler')())

app.sessionStore = sessionStore

module.exports = app
