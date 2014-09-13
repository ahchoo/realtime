module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')
  var q = require('q')
  var objectId = require('mongoose').Types.ObjectId

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  // fixtures
  return initCollection('User', [
    {email: 'fuqcool@gmail.com', name: 'John Fu', password: md5('123')},
    {email: 'test@ahchoo.com', name: 'Fantastic Spiderman', password: md5('husky')}
  ]).then(function () {

    var ids = {
      tesla: objectId(),
      iphone: objectId()
    }

    return initCollection('Item', [
      {
        _id: ids.tesla,
        title: 'Tesla Model S',
        countdown: 100,
        status: 'initialize',
        price: 75000
      }, {
        _id: ids.iphone,
        title: 'iPhone 6',
        countdown: 100,
        status: 'initialize',
        price: 850
      }
    ]).then(function () {
      return ids
    })
  }).then(function (ids) {
    return initCollection('Game', [{
      item: ids.iphone,
      capacity: 100,
      countdown: 10
    }, {
      item: ids.tesla,
      capacity: 50,
      countdown: 15
    }])
  }).then(function () {
    console.log('Initialize database succeed')
  }).fail(function (reason) {
    console.log('Initialize database failed, reason: ', reason)
  })

  // helper function
  function initCollection(name, collection) {
    var deferred = q.defer()

    models[name].remove({}, function () {
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
    })

    return deferred.promise
  }

}
