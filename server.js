#!/bin/env node

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var path = require('path')
var connect = require('connect')
var io = require('socket.io')
var cookie = require('cookie')
var sessionStore = new connect.session.MemoryStore()
var fs = require('fs')
var SITE_SECRET = 'ahchoo web site'

// init db connection
require('./lib/connect-db')()

var app = express()

app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({
  extended: true
}))

// app.use(cookieParser(SITE_SECRET))
// app.use(expressSession({
  // key: 'express.sid',
  // store: sessionStore
// }))

// fs.readdirSync('./lib/routes').forEach(function(file) {
  // if ( file[0] === '.' ) return
  // var routeName = file.substr(0, file.indexOf('.'))
  // require('./lib/routes/' + routeName)(app)
// })

// init routes
require('./lib/routes')(app)

// var Items = require('./lib/models/item')
// app.set('views', path.join(__dirname, '/demo-views'))
// app.use('/demo', express.static(path.join(__dirname, '/demo')))
// app.get('/demo', function (req, res) {
//   res.render('index', {
//     username: req.session.username
//   })
// })
// app.get('/demo/demo-socket', function (req, res) {
//   res.render('demo-socket', {
//     username: req.session.username
//   })
// })
// app.get('/demo/demo-items', function (req, res) {
//   res.render('demo-items', {
//     username: req.session.username,
//     items: Items.get()
//   })
// })
// app.get('/demo/demo-item/:itemID', function (req, res) {
//   res.render('demo-item', {
//     username: req.session.username,
//     item: Items.getById(req.param('itemID', null))
//   })
// })
// app.post('/demo/auth/login', function (req, res) {
//   req.session.username = req.param('username')
//   res.redirect('/')
// })

//app.set('views', path.join(__dirname, '/views'))
app.use('/', express.static(path.join(__dirname, '/public')))

var server = http.createServer(app)
server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
              process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
              function () {
                console.log('Server started')
              })
