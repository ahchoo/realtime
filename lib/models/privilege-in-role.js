var mongoose = require('mongoose')

var objectId = mongoose.Schema.Types.ObjectId

var PrivilegeInRoleSchema = new mongoose.Schema({
  privilege: {
    type: objectId,
    ref: 'Privilege'
  },
  role: {
    type: objectId,
    ref: 'Role'
  }
})

module.exports = mongoose.model('PrivilegeInRole', PrivilegeInRoleSchema)
