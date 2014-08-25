var mongoose = require('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var GameSchema = new mongoose.Schema({

  // which item will the winner get
  // TODO: might be an array in the future
  itemId: {
    type: ObjectId,
    required: true
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


module.exports = mongoose.model('Game', GameSchema)
