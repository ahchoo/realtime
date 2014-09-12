var mongoose = require('mongoose')

var objectId = mongoose.Schema.Types.ObjectId

var PrivilegeInRoleSchema = new mongoose.Schema({
  privilege: {
    type: objectId,
    required: true,
    ref: 'Privilege'
  },
  role: {
    type: objectId,
    required: true,
    ref: 'Role'
  }
})

module.exports = mongoose.model('PrivilegeInRole', PrivilegeInRoleSchema)
