var EventEmitter = require('events').EventEmitter
var util = require('util')
var _ = require('underscore')

function Game(id) {
  this.timeoutId = null
  this.players = []
  this.id = id

  EventEmitter.call(this)
}

util.inherits(Game, EventEmitter)

Game.prototype.start = function () {
  this.emit('start')
  this.countdown()
}

Game.prototype.countdown = function () {
  var self = this

  this.timeoutId = setTimeout(function () {
    self.stop()
  }, 10000)
}

Game.prototype.stop = function () {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId)
    this.timeoutId = null
  }

  this.emit('stop')
}

Game.prototype.reset = function () {
  clearTimeout(this.timeoutId)
  this.emit('reset')
  this.countdown()
}

Game.prototype.join = function (player) {
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
