module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')
  var q = require('q')
  var objectId = require('mongoose').Types.ObjectId

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')

  var userIds = {
    admin: objectId(),
    fu: objectId(),
    test: objectId()
  }

  var roleIds = {
    admin: objectId(),
    normal: objectId(),
    guest: objectId()
  }

  var privilegeIds = {
    admin: objectId(),
    postApiAuth: objectId(),
    postApiUser: objectId(),
    management: objectId()
  }

  // fixtures
  return initCollection('User', [
    {_id: userIds.fu, email: 'fuqcool@gmail.com', name: 'John Fu', password: md5('123')},
    {_id: userIds.test, email: 'test@ahchoo.com', name: 'Fantastic Spiderman', password: md5('husky')},
    {_id: userIds.admin, email: 'admin@ahchoo.com', name: 'Admin', password: md5('123')}
  ]).then(function () {
    // roles
    return initCollection('Role', [{
      _id: roleIds.admin,
      name: 'Admin',
      description: 'Administrators'
    }, {
      _id: roleIds.normal,
      name: 'Normal',
      description: 'Normal Users'
    }, {
      _id: roleIds.guest,
      name: 'Guest',
      description: 'Guest'
    }])
  }).then(function () {
    // privileges
    return initCollection('Privilege', [{
      _id: privilegeIds.postApiAuth,
      name: 'user login',
      method: 'post',
      path: '^/api/auth$'
    }, {
      _id: privilegeIds.postApiUser,
      name: 'create user',
      method: 'post',
      path: '^/api/users$'
    }, {
      _id: privilegeIds.management,
      name: 'web site management',
      method: '.*',
      path: '^/manage'
    }, {
      _id: privilegeIds.admin,
      name: 'all privileges',
      method: '.*',
      path: '.*'
    }])
  }).then(function () {
    // user in role
    return initCollection('UserInRole', [{
      user: userIds.fu,
      role: roleIds.normal
    }, {
      user: userIds.test,
      role: roleIds.admin
    }, {
      user: userIds.admin,
      role: roleIds.admin
    }])
  }).then(function () {
    // privileges in role
    return initCollection('PrivilegeInRole', [{
      privilege: privilegeIds.postApiAuth,
      role: roleIds.guest
    }, {
      privilege: privilegeIds.postApiAuth,
      role: roleIds.normal
    }, {
      privilege: privilegeIds.postApiUser,
      role: roleIds.guest
    }, {
      privilege: privilegeIds.admin,
      role: roleIds.admin
    }])
  }).then(function () {

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
        description: 'Hello, world!',
        price: 75000
      }, {
        _id: ids.iphone,
        title: 'Amazon Gift Card',
        countdown: 100,
        status: 'initialize',
        description: 'Bigger than bigger.',
        price: 15
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
