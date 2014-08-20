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
  }

})

var Item = mongoose.model('item', ItemSchema)

// TODO
var items = [new Item({
  title: 'shit'
}), new Item({
  title: 'fuck' // I like that
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
