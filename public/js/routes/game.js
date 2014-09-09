module.exports = function (el) {

  var ko = require('knockout')
  var io = require('socket.io-client')
  var cookie = require('cookie-cutter')
  var _ = require('underscore')

  var api = require('../lib/api')
  var router = require('../lib/router')

  var users = ko.observableArray()

  var socket = io.connect('127.0.0.1', {
    query: 'token=' + cookie.get('ahchoo_token') + '&gameId=' + router.params.gameId
  })

  socket.on('player-joined', addUser)
  socket.on('players-joined', addUserCollection)
  socket.on('player-left', removeUser)

  function addUser(user) {
    users.push(user)
  }

  function addUserCollection(users) {
    _.forEach(users, function (user) {
      addUser(user)
    })
  }

  function removeUser(target) {
    users.remove(function (user) {
      return user._id === target._id
    })
  }

  api.game.one({id: router.params.gameId}).then(function (game) {
    ko.applyBindings({
      name: game.item.title,
      users: users
    }, el)
  })

}
