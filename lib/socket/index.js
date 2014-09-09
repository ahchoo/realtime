// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('../models')

  var sio = io.listen(server)

  sio.use(function (socket, next) {
    var data = socket.request
    if (!data.headers.cookie) {
      next(new Error('Session cookie required.'))
    } else {
      data.cookie = connect.utils.parseSignedCookies(cookie.parse(data.headers.cookie), process.env.AHCHOO_SITE_SECRET)
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

    socket.room = gameId
    socket.join(gameId)

    models.UserInGame.enter(gameId, token).then(function (user) {
      console.log('player: ' + token + ' JOINED to this room: ' + socket.room)

      models.UserInGame.findUsersByGameId(gameId).then(function (users) {
        socket.emit('players-joined', users)
        socket.in(socket.room).emit('player-joined', user)
      })

      game(socket, models)
    })

    socket.on('disconnect', function () {
      socket.leave(socket.room)

      models.UserInGame.leave(gameId, token).then(function (user) {
        console.log('player: ' + token + ' DISCONNECTED from this room:' + socket.room)
        socket.in(socket.room).emit('player-left', user)
      })
    })
  })

}
