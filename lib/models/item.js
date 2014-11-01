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
  image: {
    type: String
  }
})

module.exports = mongoose.model('Item', ItemSchema)
