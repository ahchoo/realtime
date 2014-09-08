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
  enterTime: {
    type: Date
  },
})

module.exports = mongoose.model('UserInGame', UserInGameSchema)
