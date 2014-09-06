module.exports = function (el) {
  var md5 = require('MD5')
  var ko = require('knockout')
  var cookie = require('cookie-cutter')

  var api = require('../lib/api')

  ko.applyBindings({
    username: ko.observable(),
    password: ko.observable(),
    login: function () {
      var username = this.username()
      var password = md5(this.password())

      var p = api.auth.login({
        username: username,
        password: password
      })

      p.then(function (user) {
        cookie.set('ahchoo_token', user.token, {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)})
      })
    },
    loginByKey: function (data, event) {
      if (event.keyCode === 13) {
        this.login()
      } else {
        return true
      }
    }
  }, el)
}
