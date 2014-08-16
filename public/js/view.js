var ko = require('knockout')

function View(options) {
  this.me = options.me

  this.fullName = ko.computed(function () {
    return this.me.firstName + this.me.lastName
  }, this)
}

module.exports = View
