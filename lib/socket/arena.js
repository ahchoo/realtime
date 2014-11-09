var Game = require('./game')

module.exports = {
  games: {},
  addGame: function (id) {
    var self = this

    if (!this.games[id]) {
      var game = new Game(id)
      this.games[id] = game

      game.on('end', function () {
        self.removeGame(id)
      })

      game.on('player left', function () {
        if (!game.players.length) {
          self.removeGame(id)
        }
      })

      return game
    }

    return this.games[id]
  },
  removeGame: function (id) {
    if (this.games[id]) {
      delete this.games[id]
    }
  },
  game: function (id) {
    return this.games[id]
  }
}
