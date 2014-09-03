var http = require('./http')

module.exports = Controller

function Controller(options) {
  this.view = options.view
  this.ctrl = options.ctrl
}

Controller.prototype.activate = function () {
  var self = this

  http({path: this.view}).then(function (html) {
    var container = document.getElementById('app_container')

    container.innerHTML = html
    self.ctrl(container)
  })
}
