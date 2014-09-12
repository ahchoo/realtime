module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')
  var q = require('q')
  var objectId = require('mongoose').Types.ObjectId

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  var userIds = {
    fu: objectId(),
    test: objectId()
  }

  var roleIds = {
    admin: objectId(),
    normal: objectId(),
    guest: objectId()
  }

  var privilegeIds = {
    postApiAuth: objectId(),
    postApiUser: objectId()
  }

  // fixtures
  return initCollection('User', [
    {id: userIds.fu, email: 'fuqcool@gmail.com', name: 'John Fu', password: md5('123')},
    {id: userIds.test, email: 'test@ahchoo.com', name: 'Fantastic Spiderman', password: md5('husky')}
  ]).then(function () {
    // roles
    return initCollection('Role', [{
      id: roleIds.admin,
      name: 'Admin',
      description: 'Administrators'
    }, {
      id: roleIds.normal,
      name: 'Normal',
      description: 'Normal Users'
    }, {
      id: roleIds.guest,
      name: 'Guest',
      description: 'Guest'
    }])
  }).then(function () {
    // privileges
    return initCollection('Privilege', [{
      id: privilegeIds.postApiAuth,
      name: 'user login',
      method: 'post',
      path: '/auth'
    }, {
      id: privilegeIds.postApiUser,
      name: 'create user',
      method: 'post',
      path: '/users'
    }])
  }).then(function () {
    // user in role
  }).then(function () {
    // privileges in role
  }).then(function () {

    var ids = {
      tesla: objectId(),
      iphone: objectId()
    }

    return initCollection('Item', [
      {
        id: ids.tesla,
        title: 'Tesla Model S',
        countdown: 100,
        status: 'initialize',
        price: 75000
      }, {
        id: ids.iphone,
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
      capactity: 50,
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
