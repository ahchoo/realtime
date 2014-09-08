module.exports = function (el) {

  var ko = require('knockout')

  var api = require('../lib/api')
  var router = require('../lib/router')

  api.game.one({id: router.params.gameId}).then(function (game) {
    ko.applyBindings({
      name: game.item.title,
      users: [
        {
          name: 'Steve Jobs'
        },
        {
          name: 'Musk'
        }
      ]
    }, el)
  })

}
