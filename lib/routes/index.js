var auth = require('./auth')
var demo = require('./demo')

module.exports = function (app) {
  app.use('/api', auth)
  app.use('/demo', demo)
}
