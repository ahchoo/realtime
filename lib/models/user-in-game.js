var mongoose = require('mongoose')
var q = require('q')
var _ = require('underscore')

var Game = require('./game')
var User = require('./user')

var ObjectId = mongoose.Schema.Types.ObjectId

var UserInGameSchema = new mongoose.Schema({

  // refer to user
  user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },

  // refer to game
  game: {
    type: ObjectId,
    required: true,
    ref: 'Game'
  },

  // Enum: user's status in the game, can be 'live', 'leave'
  status: {
    type: String,
  },

  // when user entering this game
  enterTime: {
    type: Date,
    default: function () {
      return new Date()
    }
  }
})

UserInGameSchema.static('enter', function (gameId, token) {
  var self = this
  var deferred = q.defer()

  User.findByToken(token).then(function (user) {
    self.findOne({
      game: gameId,
      user: user.id
    }, function (err, userInGame) {
      if (userInGame) {
        self.update({game: gameId, user: user.id}, {status: 'live'}, function () {
          deferred.resolve(user)
        })
      } else {
        self.create({
          game: gameId,
          user: user.id,
          status: 'live'
        }, function () {
          deferred.resolve(user)
        })
      }
    })
  })

  return deferred.promise
})

UserInGameSchema.static('leave', function (gameId, token) {
  var self = this
  var deferred = q.defer()

  User.findByToken(token).then(function (user) {
    self.update({game: gameId, user: user.Id}, {status: 'leave'}, function () {
      deferred.resolve(user)
    })
  })

  return deferred.promise
})

UserInGameSchema.static('findUsersByGameId', function (gameId) {
  var deferred = q.defer()

  this.find({game: gameId, status: 'live'}).populate('user').exec().then(function (docs) {
    deferred.resolve(_.map(docs, function (doc) {
      return doc.user
    }))
  })

  return deferred.promise
})

module.exports = mongoose.model('UserInGame', UserInGameSchema)
