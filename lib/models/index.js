var _ = require('underscore')

// export all models

_.each(['game', 'user', 'item', 'user-in-game', 'click', 'role', 'privilege', 'user-in-role', 'privilege-in-role'], function (name) {
  var model = require('./' + name)

  module.exports[model.modelName] = model
})
