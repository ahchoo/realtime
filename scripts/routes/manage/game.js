module.exports = function (el) {
  var ko = require('knockout')
  var api = require('../../lib/api')
  var window = require('global/window')
  var document = window.document

var gameId = document.getElementById('game-id').getAttribute('data')

  ko.applyBindings({
    startGame: function () {
      api.game.start(gameId).then(function () {
        // the game has started
        console.log('should start that game')
      })
    }
  }, el)
}
