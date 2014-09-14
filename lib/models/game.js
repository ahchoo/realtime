var mongoose = require('mongoose')
var q = require('q')

var ObjectId = mongoose.Schema.Types.ObjectId

var GameSchema = new mongoose.Schema({

  // which item will the winner get
  // TODO: might be an array in the future
  item: {
    type: ObjectId,
    required: true,
    ref: 'Item'
  },

  // when is the game starting
  startTime: {
    type: Date
  },

  // the number of people a game can contain
  capacity: {
    type: Number
  },

  // game status, such as inited, started, ended
  status: String,

  // if the game is started, specify how many seconds before ending
  countdown: Number

})

GameSchema.static('findWinner', function(gameId) {
  UserInGame.find({game: gameId}, function (err, userInGames){
    userInGameIds = userInGames.map(function (userInGame) {
      return userInGame.id
    })
    Click.find({userInGame: userInGameIds}, function(err,clicks) {
      //clicks.sortByClickedTime()
    })
    //return clicks.last.userInGanme.user.id
  })
})

module.exports = mongoose.model('Game', GameSchema)
