var ko = require('knockout')
var io = require('socket.io-client')
var cookie = require('cookie-cutter')
var _ = require('underscore')
var window = require('global/window')
var document = window.document
var api = require('../../lib/api')

function GameView(gameId) {
  var self = this

  this.socket = null
  this.gameId = gameId
  this.timeRemaining = ko.observable()
  this.started = false
  this.users = ko.observableArray()
  this.admins = ko.observableArray()
  this.owner = ko.observable()

  this.balance = ko.observable(3)
  this.betDisabled = ko.computed(function () {
    return !self.balance()
  })

  this.connectSocket()
  this.socket.on('player joined', function (user) {
    if (_.isArray(user)) {
      self.addUserCollection(user)
    } else {
      self.addUser(user)
    }
  })

  this.socket.on('player left', function (user) {
    self.removeUser(user)
  })

  this.socket.on('game start', function () {
    self.start()
  })

  this.socket.on('game reset', function (user) {
    self.reset(user)
  })

  this.socket.on('game end', function () {
    self.end()
  })

  this.socket.on('admin joined', function (admin) {
    if (_.isArray(admin)) {
      self.addAdminCollection(admin)
    } else {
      self.addAdmin(admin)
    }
  })

  this.socket.on('admin left', function (admin) {
    self.removeAdmin(admin)
  })
}

GameView.prototype.start = function () {
  this.countdown = 100
  this.tick()
}

GameView.prototype.tick = function () {
  var self = this

  this.tId = setTimeout(function () {
    self.countdown -= 1
    self.timeRemaining((self.countdown / 10).toFixed(1))

    if (self.countdown > 0) {
      self.tick()
    }
  }, 100)
}

GameView.prototype.reset = function (user) {
  if (this.tId) {
    clearTimeout(this.tId)
  }
  if (user.token === cookie.get('ahchoo_token')) {
    this.balance(this.balance() - 1)
  }

  this.start()
  this.owner(user.name)
}

GameView.prototype.end = function () {
  clearTimeout(this.tId)
  if (this.owner()) {
    window.alert(this.owner() + ' is the winner!')
  }
}

GameView.prototype.addUser = function (user) {
  if (this.findUser(user._id) == null) {
    this.users.push(user)
  }
}

GameView.prototype.addUserCollection = function (users) {
  var self = this

  _.forEach(users, function (user) {
    self.addUser(user)
  })
}

GameView.prototype.findUser = function (id) {
  for (var i = 0; i < this.users().length; i++) {
    var user = this.users()[i]

    if (user._id === id) {
      return user
    }
  }

  return null
}

GameView.prototype.removeUser = function (target) {
  this.users.remove(function (user) {
    return user._id === target._id
  })
}

GameView.prototype.addAdmin = function (admin) {
  if (this.findAdmin(admin._id) == null) {
    this.admins.push(admin)
  }
}

GameView.prototype.addAdminCollection = function (admins) {
  var self = this

  _.forEach(admins, function(admin) {
    self.addAdmin(admin)
  })
}

GameView.prototype.findAdmin = function (id) {
  for (var i = 0; i < this.admins().length; i++) {
    var admin = this.admins()[i]

    if (admin._id === id) {
      return admin
    }
  }

  return null
}

GameView.prototype.removeAdmin = function (target) {
  this.admins.remove(function (admin) {
    return admin._id === target._id
  })
}

GameView.prototype.betForIt = function () {
  if (this.balance()) {
    this.socket.emit('game reset')
  }
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

GameView.prototype.startGame = function () {
  api.start.startGame(this.gameId).then(function () {
  })
}

var game = new GameView(document.getElementById('game-id').getAttribute('data'))

ko.applyBindings(game)
