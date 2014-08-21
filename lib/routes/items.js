var Items = require('../models/item')

module.exports = function (app) {
  app.get('/items', function (req, res) {
    res.send(Items.get())
  })
}
