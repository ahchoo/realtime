var mongoose = require('mongoose')

var ItemSchema = new mongoose.Schema({
  // what is the title of the item
  title: String,

  description: {
    type: String
  },

  // how much is it
  price: {
    type: Number,
    required: true
  },

  // item status
  status: String,

  // item countdown
  countdown: Number
})

module.exports = mongoose.model('Item', ItemSchema)
