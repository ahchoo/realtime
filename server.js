#!/bin/env node

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var path = require('path')
var connect = require('connect')

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
require('./lib/routes')(app)


// error handling
app.use(require('./lib/middlewares/error-handler')())

// templates
app.set('views', path.join(__dirname, '/demo-views'))

// serve static
app.use('/demo', express.static(path.join(__dirname, '/demo')))
app.use('/', express.static(path.join(__dirname, '/public')))

var server = http.createServer(app)
server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
              process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
              function () {
                console.log('Server started')
              })

require('./lib/socket')(server, sessionStore)
