var mongoose = require('mongoose')
var objectId = mongoose.Schema.Types.ObjectId

var UserInRoleSchema = new mongoose.Schema({
  user: {
    type: objectId,
    ref: 'User'
  },
  role: {
    type: objectId,
    ref: 'Role'
  }
})

module.exports = mongoose.model('UserInRole', UserInRoleSchema)
