var _ = require('underscore')

// export all models

_.each(['game', 'user', 'item', 'user-in-game', 'click'], function (name) {
  var model = require('./' + name)

  module.exports[model.modelName] = model
})
