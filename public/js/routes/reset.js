module.exports = function (el) {
  var ko = require('knockout')
  var api = require('../lib/api')

  ko.applyBindings({
    reset: function () {
      api.db.reset().then(function () {
        window.alert('reset succeed')
      })
    }
  }, el)
}
