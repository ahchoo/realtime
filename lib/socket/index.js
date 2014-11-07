// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('../models')
  var env = require('../env')
  var arena = require('./arena')

  var sio = io.listen(server)

  sio.use(function (socket, next) {
    var data = socket.request
    if (!data.headers.cookie) {
      next(new Error('Session cookie required.'))
    } else {
      data.cookie = connect.utils.parseSignedCookies(cookie.parse(data.headers.cookie), env.SITE_SECRET)
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

  sio.on('connection', function (socket) {
    var gameId = socket.request._query.gameId
    var token = socket.request._query.token

    var game = arena.addGame(gameId)

    // TODO: not sure this line should be here. I think this should after game model processed join
    socket.join(game.id)

    var puser = models.User.findByToken(token)

    puser.then(function (user) {
      game.join(user)

      //socket.emit('player joined', game.players)
      //// TODO::
      //// if an admin joined room after some players joined,
      //// this line will send the admin to joined players!
      //socket.in(game.id).emit('player joined', user)
    })

    socket.on('game reset', function () {
      puser.then(function (user) {
        game.reset(user)
      })
    })

    socket.on('disconnect', function () {
      puser.then(function (user) {
        socket.leave(game.id)
        socket.in(game.id).emit('player left', user)
        game.leave(user)
      })
    })

    game.on('start', function () {
      socket.emit('game start')
    })

    game.on('end', function () {
      socket.emit('game end')
    })

    game.on('reset', function (user) {
      socket.emit('game reset', user)
    })

    game.on('player joined', function (user) {
      socket.emit('player joined', game.players)
      socket.in(game.id).emit('player joined', user)
    })

    game.on('admin joined', function (user) {
      socket.emit('player joined', game.players)
      socket.emit('admin joined', game.admins)
      socket.in(game.id).emit('admin joined', user)
    })

    game.on('player left', function () {
      socket.in(game.id).emit('player left', user)
    })

    game.on('admin left', function () {
      socket.in(game.id).emit('admin left', user)
    })
  })
}
