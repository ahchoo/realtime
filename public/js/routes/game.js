module.exports = function (el) {

  var ko = require('knockout')
  var io = require('socket.io-client')
  var cookie = require('cookie-cutter')
  var _ = require('underscore')
  var window = require('global/window')
  var q = require('q')
  var $ = require('jquery-browserify')

  var api = require('../lib/api')
  var router = require('../lib/router')

  function GameView(gameId) {
    var self = this

    this.socket = null
    this.gameId = gameId
    this.timeRemaining = 100
    this.started = false
    this.users = ko.observableArray()

    this.connectSocket()
    this.socket.on('player-joined', function (user) {
      self.addUser(user)
    })
    this.socket.on('players-joined', function (users) {
      self.addUserCollection(users)
    })
    this.socket.on('player-left', function (user) {
      self.removeUser(user)
    })

    this.itemName = ko.observable()

    setTimeout(function () { self.reset() }, 3000)

    api.game.one({id: gameId}).then(function (game) {
      self.itemName(game.item.title)
    })
  }

  GameView.prototype.start = function () {
    var self = this

    this.tId = setTimeout(function () {
      self.timeRemaining -= 1
      self.updateTime()

      if (self.timeRemaining > 0) {
        self.start()
      }
    }, 100)
  }

  GameView.prototype.updateTime = function () {
    $('#time_remaining').text(String((this.timeRemaining / 10).toFixed(1)))
  }

  GameView.prototype.reset = function () {
    if (this.tId) {
      clearTimeout(this.tId)
    }

    this.timeRemaining = 100
    this.start()
  }

  GameView.prototype.over = function () {
    clearInterval(this.intervalId)
  }

  GameView.prototype.addUser = function (user) {
    this.users.push(user)
  }

  GameView.prototype.addUserCollection = function (users) {
    var self = this

    _.forEach(users, function (user) {
      self.addUser(user)
    })
  }

  GameView.prototype.removeUser = function (target) {
    this.users.remove(function (user) {
      return user._id === target._id
    })
  }

  GameView.prototype.connectSocket = function () {
    var query = 'token=' + cookie.get('ahchoo_token') + '&gameId=' + this.gameId

    var currentUri = window.location.href

    // need different config for local and production env
    if (currentUri.indexOf('127.0.0.1') !== -1 ||
        currentUri.indexOf('localhost') !== -1) {
      this.socket = io.connect('127.0.0.1', {query: query})
    } else {
      this.socket = io.connect('ws://realtime-ahchoo.rhcloud.com:8000', {query: query})
    }
  }

  var game = new GameView(router.params.gameId)

  ko.applyBindings(game, el)

  // ko.applyBindings(new GameView(router.params.gameId), el)
  // ko.applyBindings({itemName: 'adfksadfhksadhjf'}, el)

}
