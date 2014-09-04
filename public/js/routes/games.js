module.exports = function (el) {

  var ko = require('knockout')

  ko.applyBindings(function () {
    games: ko.observableArray()
  }, el)

}
