module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')
  var q = require('q')

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  // fixtures
  return initCollection('User', [
    {username: 'fu', password: md5('123')},
    {username: 'admin', password: md5('husky')}

  ]).then(function () {
    return initCollection('Item', [
      {
        title: 'Tesla Model S',
        countdown: 100,
        status: 'initialize',
        price: 75000
      }, {
        title: 'iPhone 6',
        countdown: 100,
        status: 'initialize',
        price: 850
      }
    ])

  }).then(function () {
    return initCollection('Game', [function () {
      var deferred = q.defer()

      models.Item.findOne({title: 'iPhone 6'}, function (err, item) {
        if (err) { return deferred.reject() }

        models.Game.create({
          item: item.id,
          capacity: 100,
          countdown: 10
        }).then(function () {
          deferred.resolve()
        }, function (err) {
          deferred.reject(err.message)
        })
      })

      return deferred.promise
    }])

  }).then(function () {
    console.log('Initialize database succeed')
  }).fail(function (reason) {
    console.log('Initialize database failed, reason: ', reason)
  })

  // helper function
  function initCollection(name, collection) {
    var deferred = q.defer()

    // clear collection first
    var p = models[name].remove().exec()

    p.then(function resolve() {
      var promises = _.map(collection, function (document) {
        if (_.isFunction(document)) {
          return document()
        } else {
          return initDocument(name, document)
        }
      })

      q.all(promises).then(function () {
        deferred.resolve()
      }, function (err) {
        deferred.reject('Unable to init collection: ' + name + ', reason: ' + err.message)
      })
    }, function reject(err) {
      deferred.reject('Unable to clear collection: ' + name + ', reason: ' + err.message)
    })

    return deferred.promise

    function initDocument(name, document) {
      return models[name].create(document)
    }
  }

}
