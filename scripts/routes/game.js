var ko = require('knockout')
var io = require('socket.io-client')
var cookie = require('cookie-cutter')
var _ = require('underscore')
var window = require('global/window')
var document = window.document

function GameView(gameId) {
  var self = this

  this.socket = null
  this.gameId = gameId
  this.timeRemaining = ko.observable()
  this.status = ko.observable('ready')
  this.users = ko.observableArray()
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

  this.socket.on('game start', function (t) {
    self.start(t + self.sync.diff)
  })

  this.socket.on('game reset', function (user, t) {
    self.reset(user, t + self.sync.diff)
  })

  this.socket.on('game end', function () {
    self.end()
  })

  this.sync = {diff: 0}

  this.socket.on('sync time 1', function (t1) {
    self.sync.d1 = Date.now() - t1

    self.socket.emit('sync time', Date.now())
  })

  this.socket.on('sync time 2', function (d2) {
    self.sync.diff = (d2 - self.sync.d1) / 2
    self.socket.emit('ready')
  })
}

GameView.prototype.start = function (t) {
  this.startTime = t + this.sync.diff
  this.endTime = this.startTime + 10000

  this.tick()
  this.status('started')
}

GameView.prototype.tick = function () {
  var self = this

  this.tId = setTimeout(function () {
    var remain = self.endTime - Date.now()

    if (remain > 10000) { remain = 10000 }

    if (remain > 0) {
      self.timeRemaining((remain / 1000).toFixed(1))
      self.tick()
    } else {
      self.timeRemaining(0)
    }
  }, 100)
}

GameView.prototype.reset = function (user, t) {
  if (this.tId) {
    clearTimeout(this.tId)
  }
  if (user.token === cookie.get('ahchoo_token')) {
    this.balance(this.balance() - 1)
  }

  this.start(t)
  this.owner(user)
}

GameView.prototype.end = function () {
  var self = this

  if (this.timeRemaining() > 0) {
    setTimeout(function () {
      self.end()
    }, this.timeRemaining() * 1000)
  }

  clearTimeout(this.tId)
  this.status('ended')

  setTimeout(function () {
    if (self.owner()) {
      if (self.owner()._id === cookie.get('ahchoo_user_id')) {
        window.alert('Congrats, you are the winner!')
      } else {
        window.alert(self.owner().name + ' is the winner!')
      }
    } else {
      window.alert('Oops, nobody get this.')
    }

    window.location.href = '/'
  })
}

GameView.prototype.addUser = function (user) {
  if (this.findUser(user._id) == null) {
    this.users.push(ko.observable(user))
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

    if (user()._id === id) {
      return user
    }
  }

  return null
}

GameView.prototype.removeUser = function (target) {
  this.users.remove(function (user) {
    return user()._id === target._id
  })
}

GameView.prototype.ownerIsMe = function () {
  if (this.owner() == null) return false

  return this.owner()._id === cookie.get('ahchoo_user_id')
}

GameView.prototype.betForIt = function () {
  if (this.status() === 'started' && this.balance() && !this.ownerIsMe()) {
    this.socket.emit('game reset')

    var el = arguments[1].currentTarget
    el.classList.add('active')
    setTimeout(function () { el.classList.remove('active') }, 200)
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
    this.socket = io.connect('ws://www-ahchoo.rhcloud.com:8000', {query: query})
  }
}

var game = new GameView(document.getElementById('game-id').getAttribute('data'))

ko.applyBindings(game)
