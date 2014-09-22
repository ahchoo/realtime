var mongoose = require('mongoose')
var UserInRole = require('./user-in-role')
var _ = require('underscore')

var RoleSchema = new mongoose.Schema({
  name: String,
  description: String
})

RoleSchema.static('findByUser', function (user, callback) {
  if (!user) {
    return this.find({
      name: 'Guest'
    }, callback)
  } else {
    UserInRole.find({
      user: user._id
    }).populate('role').exec(function (err, userInRoles) {
      callback(err, _.map(userInRoles, function (userInRole) {
        return userInRole.role
      }))
    })
  }
})

module.exports = mongoose.model('Role', RoleSchema)
