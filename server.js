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
  fs.readdirSync('routes').forEach(function(file) {
    if ( file[0] === '.' ) return
    var routeName = file.substr(0, file.indexOf('.'))
    require('./routes/' + routeName)(app)
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

sio.set('authorization', function (data, accept) {
  if (!data.headers.cookie) {
    return accept('Session cookie required.', false)
  }

  data.cookie = connect.utils.parseSignedCookies(cookie.parse(data.headers.cookie), SITE_SECRET)
  data.sessionID = data.cookie['express.sid']

  sessionStore.get(data.sessionID, function (err, session) {
    if (err) {
      return accept('Error in session store.', false)
    } else if (!session) {
      return accept('Session not found.', false)
    }

    data.session = session
    return accept(null, true)
  })
})

sio.sockets.on('connection', function (socket) {
  var hs = socket.handshake
  console.log('A socket with sessionID ' + hs.sessionID + ' connected.')

  socket.on('disconnect', function () {
    console.log('A socket with sessionID ' + hs.sessionID + ' disconnected.')
  })

  var itemID = hs.query.itemID
  if (!itemID) return

  socket.on('item:start:' + itemID, function () {
    var total = 100;
    var tId = setInterval(function () {
      socket.emit('item:countdown', {
        countdown: total--
      })
      if (total < 0) {
        clearInterval(tId)
      }
    }, 1000)
  })
})
