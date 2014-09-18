var Game = require('./game')

module.exports = {
  _games: {},
  addGame: function (id) {
    if (!this._games[id]) {
      var game = new Game(id)

      this._games[id] = game

      return game
    }

    return this._games[id]
  },
  removeGame: function (id) {
    if (this._games[id]) {
      delete this._games[id]
    }
  },
  game: function (id) {
    return this._games[id]
  }
}
