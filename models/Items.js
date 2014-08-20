var mongoose = require('mongoose')

var ItemSchema = new mongoose.Schema({
  name: String,
  status: String
})

var Item = mongoose.model('item', ItemSchema)

// TODO
var items = [new Item({
  name: 'shit',
  status: 'on air'
}), new Item({
  name: 'fuck',
  status: 'off air'
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
      if (item._id == itemID) {
        return item
      }
    }
    return null
  }
}