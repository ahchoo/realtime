var connected = false

module.exports = function () {
  if (connected) { return }

  var mongoose = require('mongoose')
  var connectionStr = require('../config/mongo')

  mongoose.connect(connectionStr, {auth: {authdb: 'admin'}})

  mongoose.connection.on('connected', function () {
    connected = true
  })

  mongoose.connection.on('error', function (err) {
    console.warn('Unable to connect to db', err)
  })
}
