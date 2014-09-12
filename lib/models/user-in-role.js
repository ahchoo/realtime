var mongoose = require('mongoose')
var objectId = mongoose.Schema.Types.ObjectId

var UserInRoleSchema = new mongoose.Schema({
  user: {
    type: objectId,
    require: true,
    ref: 'User'
  },
  role: {
    type: objectId,
    require: true,
    ref: 'Role'
  }
})

module.exports = mongoose.model('UserInRole', UserInRoleSchema)
