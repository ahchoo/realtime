var EventEmitter = require('events').EventEmitter
var util = require('util')
var _ = require('underscore')

function Game(id) {
  this.timeoutId = null
  this.players = []
  this.id = id
  this.balance = {}
  this.status = 'idle'

  EventEmitter.call(this)
}

util.inherits(Game, EventEmitter)

Game.prototype.start = function () {
  this.emit('start')
  this.status = 'started'
  this.countdown()
}

Game.prototype.countdown = function () {
  var self = this

  this.timeoutId = setTimeout(function () {
    self.end()
  }, 10000)
}

Game.prototype.end = function () {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId)
    this.timeoutId = null
  }

  this.emit('end')
  this.status = 'ended'
}

Game.prototype.findPlayer = function (id) {
  return _.filter(this.players, function (player) {
    return player.id === id
  })
}

Game.prototype.reset = function (player) {
  if (this.status !== 'started') { return }
  if (this.balance[player.id] == null) { return }
  if (this.balance[player.id] <= 0) { return }

  clearTimeout(this.timeoutId)

  this.balance[player.id] -= 1
  this.emit('reset', player)
  this.countdown()
}

Game.prototype.join = function (player) {
  this.balance[player.id] = 3

  this.players.push(player)

  this.emit('player joined', player)
}

Game.prototype.leave = function (player) {
  this.players = _.reject(this.players, function (p) {
    return p.id === player.id
  })

  this.emit('player left', player)
}

module.exports = Game
