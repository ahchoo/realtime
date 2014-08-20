var mongoose = require('mongoose')

// schema definition
var UserSchema = new mongoose.Schema({
  username: String,
  password: String
})

var User = mongoose.model('User', UserSchema)
