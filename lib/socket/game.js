// game current countdown cache
var countdowns = {}

module.exports = function (socket, models) {
  // TODO use the private '_query'
  var gameId = socket.request._query.gameId
  if (!gameId) return

  // if the game already started, emit a start event
  models.Game.findById(gameId, function (err, game) {
    if (!game || game.status !== 'started') {
      return
    } else {
      socket.emit('game:start:' + gameId, countdowns[gameId])
    }
  })

  // start the game
  socket.on('game:start:' + gameId, function () {
    models.Game.findById(gameId, function (err, game) {
      if (!game || game.status !== 'inited') {
        return
      } else {
        game.status = 'started'
        countdowns[gameId] = game.countdown
        game.save(function (err) {
          if (err) {
            socket.emit('game:countdown:error:' + gameId)
            socket.broadcast.emit('game:countdown:error:' + gameId)
          } else {
            socket.emit('game:start:' + gameId, countdowns[gameId])
            socket.broadcast.emit('game:start:' + gameId, countdowns[gameId])
            var tId = setInterval(function () {
              // TODO: that part's logic seem not not right
              //countdowns[gameId]--
              //if (countdowns[gameId] < 0) {
              //  clearInterval(tId)
              //  game.status = 'ended'
              //  game.save()
              //  socket.emit('game:end:' + gameId)
              //  socket.broadcast.emit('game:end:' + gameId)
              //}
            }, 1000)
          }
        })
      }
    })
  })

  // when a player ready to play that game
  socket.on('player-ready', function () {
    var gameId = socket.request._query.gameId
    var playerId = socket.request._query.playerId
    console.log('player: ' + playerId + ' is READY for game: ' + gameId)
    socket.in(socket.room).emit('player-ready', playerId)
  })

  // when a player change status from not ready
  socket.on('player-un-ready', function () {
    var gameId = socket.request._query.gameId
    var playerId = socket.request._query.playerId
    console.log('player: ' + playerId + ' is Not READY for game: ' + gameId)
    socket.in(socket.room).emit('player-un-ready', playerId)
  })

  // when a player clicked
  socket.on('player-clicked', function () {
    var gameId = socket.request._query.gameId
    var playerId = socket.request._query.playerId
    // TODO: need to check this player is in game
    // TODO: need to check this player is in right status
    console.log('player: ' + playerId + ' CLICK in game: ' + gameId)
    socket.in(socket.room).emit('player-clicked', playerId)
  })
}
