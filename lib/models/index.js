var _ = require('underscore')

// export all models

_.each(['game', 'user', 'item'], function (name) {
  var model = require('./' + name)

  module.exports[model.modelName] = model
})
