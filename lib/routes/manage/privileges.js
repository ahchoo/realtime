var express = require('express')
var router = express.Router()
var models = require('../../models')
var _ = require('underscore')
var async = require('async')

router
  .route('/')
  .get(function (req, res, next) {
    models.Privilege.find(function (err, privileges) {
      if (err) {
        next(err)
      } else {
        res.render('manage/privileges', {
          title: 'Privileges',
          privileges: privileges
        })
      }
    })
  })

router
  .route('/:privilegeId')
  .get(function (req, res) {
    var privilegeId = req.param('privilegeId')
    var title = privilegeId === 'new' ? 'Create Privilege' : 'Update Privilege'
    var tasks = []

    tasks.push(function (callback) {
      models.Role.find(callback)
    })
    if (privilegeId === 'new') {
      // Create
      tasks.push(function (roles, callback) {
        res.render('manage/privilege', {
          title: title,
          privilege: {
            name: '',
            method: '',
            path: ''
          },
          roles: roles
        })
        callback()
      })
    } else {
      tasks.push(function (roles, callback) {
        models.PrivilegeInRole.find({
          privilege: privilegeId
        }, function (err, privilegeInRoles) {
          callback(err, roles, privilegeInRoles)
        })
      })
      tasks.push(function (roles, privilegeInRoles, callback) {
        var roleIds = _.map(privilegeInRoles, function (privilegeInRole) {
          return privilegeInRole.role.toString()
        })
        _.each(roles, function (role) {
          if (_.contains(roleIds, role._id.toString())) {
            role.selected = 'checked'
          }
        })
        models.Privilege.findById(privilegeId, function (err, privilege) {
          if (!privilege) {
            err = new Error('Invalid privilege ID: ' + privilegeId)
          }
          callback(err, roles, privilege)
        })
      })
      tasks.push(function (roles, privilege, callback) {
        res.render('manage/privilege', {
          title: title,
          privilege: privilege,
          roles: roles
        })
        callback()
      })
    }

    async.waterfall(tasks, function (err, roles, privilege) {
      if (err) {
        res.render('manage/privilege', {
          title: title,
          privilege: privilege || {},
          roles: roles || [],
          errors: err instanceof Array ? err : [err]
        })
      }
    })
  })
  .post(function (req, res) {
    var privilegeId = req.param('privilegeId')
    var title = privilegeId === 'new' ? 'Create Privilege' : 'Update Privilege'
    var name = req.body.name
    var method = req.body.method
    var path = req.body.path
    var selectedRoleIds = req.body.roles
    var tasks = []
    var errors = []

    selectedRoleIds = selectedRoleIds instanceof Array ? selectedRoleIds : [selectedRoleIds]

    tasks.push(function (callback) {
      models.Role.find(callback)
    })
    if (privilegeId === 'new') {
      // Create
      tasks.push(function (roles, callback) {
        if (!name) errors.push('Name is required')
        if (!method) errors.push('Method is required')
        if (!path) errors.push('Path is required')

        if (errors.length) {
          callback(errors, roles, {
            name: name,
            method: method, 
            path: path
          })
        } else {
          models.Privilege.create({
            name: name,
            method: method.toLowerCase(),
            path: path
          }, function (err, privilege) {
            callback(err, roles, privilege)
          })
        }
      })
      tasks.push(function (roles, privilege, callback) {
        if (selectedRoleIds.length) {
          var documents = _.map(selectedRoleIds, function (roleId) {
            return {
              role: roleId,
              privilege: privilege._id
            }
          })
          models.PrivilegeInRole.create(documents)
        }
        res.set('Refresh', '2; url=/manage/privileges')
        res.render('manage/privilege', {
          title: title,
          privilege: privilege,
          roles: roles,
          infoes: ['Privilege Created...']
        })
        callback()
      })
    } else {
      // Update
    }

    async.waterfall(tasks, function (err, roles, privilege) {
      if (err) {
        res.render('manage/privilege', {
          title: title,
          privilege: privilege || {},
          roles: roles || [],
          errors: err instanceof Array ? err : [err]
        })
      }
    })
  })

router
  .route('/:privilegeId/delete')
  .post(function (req, res) {
    var privilegeId = req.param('privilegeId')
    var tasks = []

    tasks.push(function (callback) {
      models.Role.find(callback)
    })
    tasks.push(function (roles, callback) {
      if (!privilegeId) {
        callback(new Error('ID is required'), roles, {
          name: '',
          method: '',
          path: ''
        })
      } else {
        models.Privilege.findByIdAndRemove(privilegeId, function (err, privilege) {
          callback(err, roles, privilege)
        })
      }
    })
    tasks.push(function (roles, privilege, callback) {
      models.PrivilegeInRole.remove({
        privilege: privilegeId
      }, function (err) {
        callback(err, roles, privilege)
      })
    })
    tasks.push(function (roles, privilege, callback) {
      res.set('Refresh', '2; url=/manage/privileges')
      res.render('manage/privilege', {
        title: 'Update Privilege',
        roles: roles,
        privilege: privilege,
        infoes: ['This privilege has been removed...']
      })
      callback()
    })

    async.waterfall(tasks, function (err, roles, privilege) {
      if (err) {
        res.render('manage/privilege', {
          title: 'Update Privilege',
          roles: roles || [],
          privilege: privilege || {},
          errors: err instanceof Array ? err : [err]
        })
      }
    })
  })

module.exports = router
