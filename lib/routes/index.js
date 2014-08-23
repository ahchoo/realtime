var auth = require('./auth')
var demo = require('./demo')
var item = require('./item')

module.exports = function (app) {
  app.use('/api', auth)
  app.use('/api', item)
  app.use('/demo', demo)
}
