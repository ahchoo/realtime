module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')
  var q = require('q')
  var mongoose = require('mongoose')

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  console.log('Drop previous database')

  return dropDb().then(function () {
    console.log('succeed')

    // fixtures
    return initCollection('User', [
      {email: 'fuqcool@gmail.com', name: 'John Fu', password: md5('123')},
      {email: 'test@ahchoo.com', name: 'Fantastic Spiderman', password: md5('husky')},
      {email: 'hah@ahchoo.com', name: 'Ironman', password: md5('shit')}
    ])
  }).then(function () {
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

    var promises = _.map(collection, function (document) {
      if (_.isFunction(document)) {
        return document()
      } else {
        return models[name].create(document)
      }
    })

    q.all(promises).then(function () {
      deferred.resolve()
    }, function (err) {
      deferred.reject('Unable to init collection: ' + name + ', reason: ' + err.message)
    })

    return deferred.promise
  }

  function dropDb() {
    var deferred = q.defer()
    mongoose.connection.db.dropDatabase(function (err) {
      if (err) {
        deferred.reject()
      } else {
        deferred.resolve()
      }
    })

    return deferred.promise
  }

}
