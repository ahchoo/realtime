var mongoose = require('mongoose')
var _s = require('underscore.string')
var _ = require('underscore')

var config = require('../../config/mongo')

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

// export all models
_.each(['game', 'user'], function (name) {
  var className = _s.capitalize(name)
  module.exports[className] = mongoose.model(className, require('./' + name))
})
