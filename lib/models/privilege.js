var mongoose = require('mongoose')

var PrivilegeSchema = new mongoose.Schema({
  name: String,
  method: String,
  path: String
})

module.exports = mongoose.model('Privilege', PrivilegeSchema) 
