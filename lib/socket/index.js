// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('../models')
  var game = require('./game')

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
    var playerId = socket.request._query.playerId
    socket.room = gameId
    socket.join(gameId)
    console.log('player: ' + playerId + ' JOINED to this room: ' + socket.room)

    game(socket, models)

    socket.on('disconnect', function () {
      var playerId = socket.request._query.playerId
      //console.log('close', playerId)
      socket.leave(socket.room)
      socket.in(socket.room).emit('player-leaved', playerId)
      console.log('player: ' + playerId + ' DISCONNECTED from this room:' + socket.room)
      // don't know how to destroy this object...
      socket = null
    })
  })

}
