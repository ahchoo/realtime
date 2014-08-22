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

var Item = mongoose.model('item', ItemSchema)

// TODO
var items = [new Item({
  title: 'shit',
  countdown: 100,
  status: 'initialize'
}), new Item({
  title: 'fuck', // I like that
  countdown: 100,
  status: 'initialize'
})]

module.exports = {
  Item: Item,
  get: function () {
    return items
  },
  getById: function (itemID) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      if (String(item._id) === String(itemID)) {
        return item
      }
    }
    return null
  }
}
