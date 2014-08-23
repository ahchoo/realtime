var auth = require('./auth')

module.exports = function (app) {
  app.use('/api', auth)
}
