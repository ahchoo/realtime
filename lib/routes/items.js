var Items = require('../models/Items')

module.exports = function (app) {
  app.get('/items', function (req, res) {
    res.send(Items.get())
  })
}