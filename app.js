var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var path = require('path')
var connect = require('connect')
var fs = require('fs')

var sessionStore = new connect.session.MemoryStore()

process.env.AHCHOO_SITE_SECRET = 'ahchoo web site'

// init db connection
require('./lib/connect-db')()

var app = express()

app.set('view engine', 'jade')

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cookieParser(process.env.AHCHOO_SITE_SECRET))

app.use(expressSession({
  key: 'express.sid',
  store: sessionStore
}))

// api routes
app.use(require('./lib/routes'))

// error handling
app.use(require('./lib/middlewares/error-handler')())

// templates
app.set('views', path.join(__dirname, '/demo-views'))

// serve static
app.use('/demo', express.static(path.join(__dirname, '/demo')))
app.use('/dist', express.static(path.join(__dirname, '/public/dist')))
app.use('/vendor', express.static(path.join(__dirname, '/public/vendor')))
app.use('/views', express.static(path.join(__dirname, '/public/views')))

app.use(function (req, res) {
  var buf = fs.readFileSync('public/index.html')
  res.send(buf.toString())
})

app.sessionStore = sessionStore

module.exports = app
