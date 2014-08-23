module.exports = function () {

  var config = require('../config/mongo')
  var mongoose = require('mongoose')

  var connectionStr =
    'mongodb://' +
    config.host + ':' +
    config.port + '/' +
    config.database

  mongoose.connect(connectionStr, {
    user: config.username,
    pass: config.password,
    auth: {
      authdb: config.authdb
    }
  })

  mongoose.connection.on('error', function (err) {
    console.warn('Unable to connect to db', err)
  })
}
