var _ = require('underscore')

// export all models

_.each(['game', 'user'], function (name) {
  var model = require('./' + name)

  module.exports[model.modelName] = model
})
