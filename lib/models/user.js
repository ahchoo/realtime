var mongoose = require('mongoose')
var uuid = require('node-uuid')

// schema definition
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
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
})

module.exports = mongoose.model('User', UserSchema)
