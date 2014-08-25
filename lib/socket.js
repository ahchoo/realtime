// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('./models')

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

  sio.sockets.on('connection', function (socket) {
    // TODO use the private '_query'
    var gameId = socket.request._query.gameId
    if (!gameId) return

    socket.on('game:start:' + gameId, function () {
      models.Game.findById(gameId, function (err, game) {
        if (!game || game.status !== 'inited') return

        game.status = 'started'
        console.log('game:countdown:start', gameId)
        game.save(function (err) {
          if (err) {
            socket.broadcast.emit('game:countdown:error:' + gameId)
            socket.emit('game:countdown:error:' + gameId)
          } else {
            var tId = setInterval(function () {
              models.Game.findById(gameId, function (err, g) {
                if (err) {
                  socket.broadcast.emit('game:countdown:error:' + gameId)
                  socket.emit('game:countdown:error:' + gameId)
                } else {
                  console.log('game:countdown:counting', gameId, g.countdown)
                  socket.broadcast.emit('game:countdown:' + gameId, {
                    countdown: g.countdown
                  })
                  socket.emit('game:countdown:' + gameId, {
                    countdown: g.countdown
                  })
                  g.countdown--
                  if (g.countdown < 0) {
                    clearInterval(tId)
                    g.countdown = 0
                    g.status = 'ended'
                    console.log('game:countdown:end', gameId)
                  }
                  g.save()
                }
              })
            }, 1000)
          }
        })
      })
    })
  })

}
