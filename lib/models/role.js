var mongoose = require('mongoose')

var RoleSchema = new mongoose.Schema({
  name: String,
  description: String
})

module.exports = mongoose.model('Role', RoleSchema)
