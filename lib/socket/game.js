var q = require('q')
// game current countdown cache
var countdowns = {}
var gameTimeouts = {}
var gameTotalClicks = {}
var runningGames = {}

module.exports = function (socket, models) {
  // TODO use the private '_query'
  var gameId = socket.request._query.gameId
  if (!gameId) return

  // NOTE: what is that part doing?
  // if the game already started, emit a start event
  //models.Game.findById(gameId, function (err, game) {
  //  if (!game || game.status !== 'started') {
  //    return
  //  } else {
  //    socket.emit('game:start:' + gameId, countdowns[gameId])
  //  }
  //})

  // start the game
  socket.on('game:start:' + gameId, function () {
    models.Game.findById(gameId, function (err, game) {
      if (!game || game.status !== 'inited') {
        return
      } else {
        game.status = 'started'
        countdowns[gameId] = game.countdown
        models.UserInGame.findUsersByGameId(gameId).then(function (users) {
          gameTotalClicks[gameId] = users.length
        })
        game.save(function (err) {
          if (err) {
            socket.emit('game:countdown:error:' + gameId)
            socket.broadcast.emit('game:countdown:error:' + gameId)
          } else {
            runningGames[gameId] = gameId
            socket.emit('game:start:' + gameId, countdowns[gameId])
            socket.broadcast.emit('game:start:' + gameId, countdowns[gameId])
          }
        })
      }
    })
  })

  // when a player clicked
  socket.on('player-clicked', function () {
    var gameId = socket.request._query.gameId
    var playerId = socket.request._query.playerId
    var ipAddress = socket.andshake.address
    Click.clicked(playerId, gameId, ipAddress, new Date().getTime()).then(function (click) {
      if (click) {
        startGameTimeout(gameId, gameTimeouted).then(function (continueGame) {
          if (continueGame) {
            console.log('player: ' + playerId + ' CLICK in game: ' + gameId)
            socket.in(socket.room).emit('player-clicked', playerId)
          }
        })
      } else {
        socket.in(socket.room).emit('invalid-click', playerId)
      }
    })
  })
}

// a new game count down
var startGameTimeout = function (gameId, gameEnded) {
  var deferred = q.defer()
  if (gameTimeouts[gameId] == undefined) {
    gameTimeouts[gameId] = setTimeout(gameEnded, countdowns[gameId])
    gameTotalClicks[gameId]--
  } else if (gameTotalClicks[gameId] > 0) {
    clearTimeout(gameTimeouts[gameId])
    gameTimeouts[gameId] = setTimeout(gameEnded, countdowns[gameId])
    gameTotalClicks[gameId]--
  } 
  // check if there is no click left, if no, ended the game
  if (gameTotalClicks[gameId] == 0) {
    // no click left, ended that game
    gameEnded()
    deferred.resolve(false)
  } else {
    deferred.resolve(true)
  }

  return deferred.promise
}

var gameTimeouted = function (gameId) {
  // TODO: check who is winner
  


  delete countdowns[gameId]
  delete gameTimeouts[gameId]
  delete gameTotalClicks[gameId]
  delete runningGames[gameId]
}
