module.exports = function (el) {
  var ko = require('knockout')
  var api = require('../../lib/api')

  ko.applyBindings({
    startGame: function () {
      api.game.start(gameId).then(function () {
        // the game has started
      })
    }
  }, el)
}
