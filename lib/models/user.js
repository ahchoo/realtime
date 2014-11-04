var mongoose = require('mongoose')
var uuid = require('node-uuid')
var _ = require('underscore')
var q = require('q')

// schema definition
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    default: uuid.v4  // uuid will be generated every time we create a user
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

UserSchema.method('info', function () {
  return _.pick(this, 'email', 'name', 'token')
})

UserSchema.static('findByToken', function (token) {
  var deferred = q.defer()

  this.findOne({token: token}, function (err, user) {
    deferred.resolve(user)
  })

  return deferred.promise
})

module.exports = mongoose.model('User', UserSchema)
