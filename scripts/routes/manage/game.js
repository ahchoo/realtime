module.exports = function (el) {
  var ko = require('knockout')
  var api = require('../../lib/api')
  var window = require('global/window')
  var document = window.document

  var gameId = document.getElementById('game-id').getAttribute('data')

  console.log(gameId)

  ko.applyBindings({
    start: function () {
      api.game.start(gameId).then(function () {
        console.log('should start that game')
      })
    }
  }, el)
}
