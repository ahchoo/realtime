/* global beforeEach, afterEach, describe, it */

var should  = require('should')
var mockgoose = require('mockgoose')
var objectId = require('mongoose').Types.ObjectId
var models = require('../../lib/models')
var permission = require('../../lib/middlewares/permission')
var async = require('async')

describe('permission test', function () {
  var userIds = {
    admin: objectId(),
    withPermission: objectId(),
    withoutPermission: objectId()
  }
  var roleIds = {
    admin: objectId(),
    guest: objectId(),
    withPermission: objectId(),
    withoutPermission: objectId()
  }
  var privilegeIds = {
    guest: objectId(),
    normal: objectId(),
    admin: objectId()
  }

  beforeEach(function (done) {
    var tasks = [function (callback) {
      models.User.create([{
        _id: userIds.admin,
        name: 'Admin',
        email: 'Admin@test.com',
        password: '123'
      }, {
        _id: userIds.withPermission,
        name: 'With Permission',
        email: 'withPermission@test.com',
        password: '123'
      }, {
        _id: userIds.withoutPermission,
        name: 'Without Permission',
        email: 'withoutPermission@test.com',
        password: '123'
      }], function (err) {
        callback(err)
      })
    }, function (callback) {
      models.Role.create([{
        _id: roleIds.admin,
        name: 'Admin'
      }, {
        _id: roleIds.guest,
        name: 'Guest'
      }, {
        _id: roleIds.withPermission,
        name: 'With Permission'
      }, {
        _id: roleIds.withoutPermission,
        name: 'Without Permission'
      }], function (err) {
        callback(err)
      })
    }, function (callback) {
      models.Privilege.create([{
        _id: privilegeIds.guest,
        name: 'Guest',
        method: 'get',
        path: '^/api/guest'
      }, {
        _id: privilegeIds.normal,
        name: 'Normal',
        method: 'post',
        path: '^/api/normal'
      }, {
        _id: privilegeIds.admin,
        name: 'Admin',
        method: 'post',
        path: '^/api/admin'
      }], function (err) {
        callback(err)
      })
    }, function (callback) {
      models.UserInRole.create([{
        user: userIds.admin,
        role: roleIds.admin
      }, {
        user: userIds.withPermission,
        role: roleIds.withPermission
      }, {
        user: userIds.withoutPermission,
        role: roleIds.withoutPermission
      }], function (err) {
        callback(err)
      })
    }, function (callback) {
      models.PrivilegeInRole.create([{
        privilege: privilegeIds.guest,
        role: roleIds.admin
      }, {
        privilege: privilegeIds.guest,
        role: roleIds.guest
      }, {
        privilege: privilegeIds.guest,
        role: roleIds.withPermission
      }, {
        privilege: privilegeIds.normal,
        role: roleIds.admin
      }, {
        privilege: privilegeIds.normal,
        role: roleIds.withPermission
      }, {
        privilege: privilegeIds.admin,
        role: roleIds.admin
      }], function (err) {
        callback(err)
      })
    }]

    async.waterfall(tasks, function (err) {
      if (err) throw err
      done()
    })
  })

  afterEach(function () {
    mockgoose.reset()
  })

  it('should guest, admin and normal user can access /api/no-setting-permission', function (done) {
    var path = '/api/no-setting-permission'
    var method = 'get'
    var tasks = [function (callback) {
      permission.checkPermission(path, method, null, callback)
    }, function (callback) {
      permission.checkPermission(path, method, { _id: userIds.admin }, callback)
    }, function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withPermission }, callback)
    }]
    async.waterfall(tasks, function (err) {
      should(err).not.be.ok
      done()
    })
  })

  it('should guest, admin and normal user can access /api/guest', function (done) {
    var path = '/api/guest'
    var method = 'get'
    var tasks = [function (callback) {
      permission.checkPermission(path, method, null, callback)
    }, function (callback) {
      permission.checkPermission(path, method, { _id: userIds.admin }, callback)
    }, function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withPermission }, callback)
    }]
    async.waterfall(tasks, function (err) {
      should(err).not.be.ok
      done()
    })
  })

  it('should no permission user can not access /api/guest', function (done) {
    var path = '/api/guest'
    var method = 'get'
    permission.checkPermission(path, method, { _id: userIds.withoutPermission }, function (err) {
      should(err).be.ok
      done()
    })
  })

  it('should admin and normal user can access /api/normal', function (done) {
    var path = '/api/normal'
    var method = 'post'
    var tasks = [function (callback) {
      permission.checkPermission(path, method, { _id: userIds.admin }, callback)
    }, function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withPermission }, callback)
    }]
    async.waterfall(tasks, function (err) {
      should(err).not.be.ok
      done()
    })
  })

  it('should guest and no permission user can not access /api/normal', function (done) {
    var path = '/api/normal'
    var method = 'post'
    var tasks = []
    tasks.push(function (callback) {
      permission.checkPermission(path, method, null, function (err) {
        should(err).be.ok
        callback()
      })
    })
    tasks.push(function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withoutPermission }, function (err) {
        should(err).be.ok
        callback()
      })
    })
    async.waterfall(tasks, function (err) {
      should(err).not.be.ok
      done()
    })
  })

  it('should only admin can access /api/admin', function (done) {
    var path = '/api/admin'
    var method = 'post'
    permission.checkPermission(path, method, { _id: userIds.admin }, function (err) {
      should(err).not.be.ok
      done()
    })
  })

  it('should guest, normal user and no permission user can not access /api/admin', function (done) {
    var path = '/api/admin'
    var method = 'post'
    var tasks = []
    tasks.push(function (callback) {
      permission.checkPermission(path, method, null, function (err) {
        should(err).be.ok
        callback()
      })
    })
    tasks.push(function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withPermission }, function (err) {
        should(err).be.ok
        callback()
      })
    })
    tasks.push(function (callback) {
      permission.checkPermission(path, method, { _id: userIds.withoutPermission }, function (err) {
        should(err).be.ok
        callback()
      })
    })
    async.waterfall(tasks, function (err) {
      should(err).not.be.ok
      done()
    })
  })
})
