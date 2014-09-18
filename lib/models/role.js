var mongoose = require('mongoose')
var q = require('q')
var UserInRole = require('./user-in-role')
var _ = require('underscore')

var RoleSchema = new mongoose.Schema({
  name: String,
  description: String
})

RoleSchema.static('findByUser', function (user) {
  if (!user) {
    return this.find({
      name: 'Guest'
    }).exec()
  } else {
    var deferred = q.defer()
    UserInRole.find({
      user: user._id
    }).populate('role').exec(function (err, userInRoles) {
      deferred.resolve(_.map(userInRoles, function (userInRole) {
        return userInRole.role
      }))
    })
    return deferred.promise
  }
})

module.exports = mongoose.model('Role', RoleSchema)
