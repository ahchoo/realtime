module.exports = function (callback) {

  // For linting...
  // var _ = require('underscore')
  var md5 = require('MD5')
  var async = require('async')

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  // User fixture
  function initUserCollection(cb) {
    initCollection('User', [
      {username: 'fu', password: md5('123')},
      {username: 'admin', password: md5('husky')}
    ], cb)
  }

  // Game fixture
  function initGameCollection(cb) {
    initCollection('Game', [], cb)
  }

  // Item fixture
  function initItemCollection(cb) {
    initCollection('Item', [
      {
        title: 'shit',
        countdown: 100,
        status: 'initialize',
        price: 100
      }, {
        title: 'fuck', // I like that
        countdown: 100,
        status: 'initialize',
        price: 75
      }
    ], cb)
  }


  function initCollection(name, list, cb) {
    // clear collection first
    models[name].remove(function (err) {
      if (err) {
        console.log('Unable to clear User collection')
        return
      }

      async.each(list, function(obj, cb) {
        models[name].create(obj).then(function resolve(obj) {
          console.log('Created', obj)
          cb()
        }, function error(err) {
          console.warn('Unable to create document', err)
          cb()
        })
      }, cb)
    })
  }

  async.parallel([initUserCollection, initGameCollection, initItemCollection], callback)
}
