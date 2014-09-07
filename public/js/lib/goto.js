var ko = require('knockout')
var router = require('./router')

ko.bindingHandlers.goto = {
  init: function (element, valueAccessor) {
    element.addEventListener('click', function (evt) {
      router.goto(valueAccessor())

      evt.preventDefault()
    })
  }
}
