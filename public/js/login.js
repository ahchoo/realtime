module.exports = function (el) {
  var md5 = require('MD5')
  var http = require('../lib/http')
  var ko = require('knockout')

  ko.applyBindings({
    username: ko.observable(),
    password: ko.observable(),
    login: function () {
      var username = this.username()
      var password = md5(this.password())

      http({
        method: 'POST',
        path: '/api/auth',
        body: 'username=' + username + '&password=' + password
      }).then(function (res) {
        var data = JSON.parse(res)

        if (data.error) {
          window.alert(data.error.message)
        } else {
          window.alert('login succeed')
        }
      })
    }
  }, el)
}
