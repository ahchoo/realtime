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
  name: 'shit'
}), new Item({
  name: 'fuck' // I like that
})]

module.exports = {
  Item: Item,
  get: function () {
    return items
  },
  getById: function (itemID) {
    console.log('itemID', itemID)
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      console.log('item._id', item._id)
      if (item._id === itemID) {
        return item
      }
    }
    return null
  }
}
