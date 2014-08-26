var auth = require('./auth')
var demo = require('./demo')
var item = require('./item')
var game = require('./game')

module.exports = function (app) {
  app.use('/api', auth)
  app.use('/api', item)
  app.use('/api', game)
  app.use('/demo', demo)
}
