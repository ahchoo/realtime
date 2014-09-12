var mongoose = require('mongoose')

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

module.exports = mongoose.model('Click', ClickSchema)
