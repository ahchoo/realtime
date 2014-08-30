var mongoose = require('mongoose')

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

  // the user's status in that game
  status: {
    type: String,
  },

  // when user entering this game
  // NOTE: not sure this is useful
  enter_time: {
    type: Date
  },

  ip_address: {
    type: String
  },

  // is this necessary?
  game_token: {
    type: String
  }

})

module.exports = mongoose.model('UserInGame', UserInGameSchema)
