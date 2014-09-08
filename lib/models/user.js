var mongoose = require('mongoose')
var uuid = require('node-uuid')
var _ = require('underscore')

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

module.exports = mongoose.model('User', UserSchema)
