module.exports = function (el) {

  var ko = require('knockout')
  var _ = require('underscore')

  var api = require('../lib/api')

  var $games = ko.observableArray()

  ko.applyBindings({
    games: $games
  }, el)

  api.game.list().then(function (games) {
    _.forEach(games, function (game) {
      $games.push(game)
    })
  })

}
