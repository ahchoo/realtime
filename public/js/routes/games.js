module.exports = function (el) {

  var ko = require('knockout')

  ko.applyBindings({
    games: ko.observableArray()
  }, el)

}
