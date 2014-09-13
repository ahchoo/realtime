var q = require('q')
var env = require('./env')

var connected = false

module.exports = function () {
  var deferred = q.defer()

  if (connected) {
    deferred.resolve()
    return deferred.promise
  }

  var mongoose = require('mongoose')

  mongoose.connect(env.MONGO_DB_CONN_STR, {auth: {authdb: 'admin'}})

  mongoose.connection.on('connected', function () {
    connected = true
    deferred.resolve()
  })

  mongoose.connection.on('error', function (err) {
    console.warn('Unable to connect to db', err)
    deferred.reject()
  })

  return deferred.promise
}
