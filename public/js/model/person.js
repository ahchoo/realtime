var ko = require('knockout')

module.exports = function (person) {
  this.firstName = person.firstName
  this.lastName = person.lastName

  this.fullName = ko.computed(function () {
    return this.firstName + ' ' + this.lastName
  }, this)
}
