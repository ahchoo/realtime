var mongoose = require('mongoose')
var q = require('q')

var ObjectId = mongoose.Schema.Types.ObjectId

var ClickSchema = new mongoose.Schema({

  // this click belong to which user in which game
  userInGame: {
    type: ObjectId,
    required: true,
    ref: 'UserInGame'
  },

  // click time
  clickTime: {
    type: Date,
    required: true
  },

  // ip address of this click
  ipAddress: {
    type: String
  }

})

ClickSchema.static('clicked', function (playerId, gameId, ipAddress, clickedTime) {
  var self = this
  var deferred = q.defer()
  
  Game.findById(gameId).then(function (game) {
    if (game &&  game.status == 'started') {
      UserInGame.find({user: playerId, game: gameId}).then(function (userInGame) {
        var err = null
        if (!userInGame) {
          deferred.resolve(new Error('player not in that game'), null)
        } else {
          self.create({userInGame: userInGame.id, clickTime: clickedTime, ipAddress: ipAddress}).then(function (err, click) {
            if (!err) {
              deferred.resolve(null, click)
            } else {
            deferred.resolve(err, null)}
          }) 
        }
      })
    } else {
      deferred.resolve(new Error('game not exist'), null)
    }
  })
  
  return deferred.promise
})

module.exports = mongoose.model('Click', ClickSchema)
