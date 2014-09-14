module.exports = function (el) {
  var ko = require('knockout')
  var io = require('socket.io-client')
  var cookie = require('cookie-cutter')
  var _ = require('underscore')
  var window = require('global/window')

  var api = require('../lib/api')
  var router = require('../lib/router')

  var users = ko.observableArray()

  var socket
  var query = 'token=' + cookie.get('ahchoo_token') + '&gameId=' + router.params.gameId

  var currentUri = window.location.href

  var socketUrl
  if (currentUri.indexOf('127.0.0.1') !== -1 ||
      currentUri.indexOf('localhost') !== -1) {
    socketUrl = '127.0.0.1'
  } else {
    socketUrl = 'ws://realtime-ahchoo.rhcloud.com:8000'
  }

  socket = io.connect(socketUrl, {query: query, 'forceNew': true})

  socket.on('connect', function () {
    console.log('connected')
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
  
  function leaveRoom() {
    socket.disconnect()
    router.goto('/games')
  }

  api.game.one({id: router.params.gameId}).then(function (game) {
    ko.applyBindings({
      name: game.item.title,
      users: users,
      leaveRoom: leaveRoom
    }, el)
  })
}
