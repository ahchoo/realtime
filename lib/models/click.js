var mongoose = require('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var ClickSchema = new mongoose.Schema({

  // this click belong to which user in which game
  user_in_game: {
    type: ObjectId,
    required: true,
    ref: 'UserInGame'
  },

  // click time
  click_time: {
    type: Date,
    required: true
  },

  // ip address of this click
  ip_address: {
    type: String
  }

})

module.exports = mongoose.model('Click', ClickSchema)
