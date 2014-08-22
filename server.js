#!/bin/env node

var http = require('http')
var express = require('express')
var path = require('path')
var connect = require('connect')
var io = require('socket.io')
var cookie = require('cookie')
var sessionStore = new connect.session.MemoryStore()
var fs = require('fs')
var SITE_SECRET = 'ahchoo web site'

var app = express()

// production
//app.set('env', 'production')

app.configure(function () {
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.cookieParser(SITE_SECRET))
  app.use(express.session({
    key: 'express.sid',
    store: sessionStore
  }))
  fs.readdirSync('./lib/routes').forEach(function(file) {
    if ( file[0] === '.' ) return
    var routeName = file.substr(0, file.indexOf('.'))
    require('./lib/routes/' + routeName)(app)
  })
})

app.configure('development', function () {
  var Items = require('./lib/models/item')
  app.set('views', path.join(__dirname, '/demo-views'))
  app.use('/', express.static(path.join(__dirname, '/demo')))
  app.get('/', function (req, res) {
    res.render('index', {
      username: req.session.username
    })
  })
  app.get('/demo-socket', function (req, res) {
    res.render('demo-socket', {
      username: req.session.username
    })
  })
  app.get('/demo-items', function (req, res) {
    res.render('demo-items', {
      username: req.session.username,
      items: Items.get()
    })
  })
  app.get('/demo-item/:itemID', function (req, res) {
    res.render('demo-item', {
      username: req.session.username,
      item: Items.getById(req.param('itemID', null))
    })
  })
  app.post('/auth/login', function (req, res) {
    req.session.username = req.param('username')
    res.redirect('/')
  })
})

app.configure('production', function () {
  app.set('views', path.join(__dirname, '/views'))
  app.use('/', express.static(path.join(__dirname, '/public')))
})

var server = http.createServer(app)
server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
              process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
              function () {
                console.log('Server started')
              })

// Socket.io

var sio = io.listen(server)

sio.use(function (socket, next) {
  var data = socket.request
  if (!data.headers.cookie) {
    next(new Error('Session cookie required.'))
  } else {
    data.cookie = connect.utils.parseSignedCookies(cookie.parse(data.headers.cookie), SITE_SECRET)
    data.sessionID = data.cookie['express.sid']
    sessionStore.get(data.sessionID, function (err, session) {
      if (err) {
        next(new Error('Error in session store.'))
      } else if (!session) {
        next(new Error('Session not found.'))
      } else {
        data.session = session
        next()
      }
    })
  }
})

sio.sockets.on('connection', function (socket) {
  // TODO use the private '_query'
  var itemID = socket.request._query.itemID
  if (!itemID) return

  var Items = require('./lib/models/item')

  socket.on('item:start:' + itemID, function () {
    var item = Items.getById(itemID)
    if (!item || item.status === 'started') return

    item.status = 'started'
    var tId = setInterval(function () {
      socket.broadcast.emit('item:countdown:' + itemID, {
        countdown: item.countdown
      })
      socket.emit('item:countdown:' + itemID, {
        countdown: item.countdown
      })
      item.countdown--
      if (item.countdown < 0) {
        clearInterval(tId)
        item.status = 'ended'
        item.countdown = 100
      }
    }, 1000)
  })
})