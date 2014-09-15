module.exports = function (el) {
  var md5 = require('MD5')
  var ko = require('knockout')
  var cookie = require('cookie-cutter')

  var api = require('../lib/api')
  var router = require('../lib/router')

  ko.applyBindings({
    email: ko.observable(),
    password: ko.observable(),
    login: function () {
      var email = this.email()
      var password = md5(this.password())

      api.auth.login({
        email: email,
        password: password
      }).then(function (user) {
        cookie.set('ahchoo_token', user.token, {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)})
        router.goto('/')
      })
    },
    loginByKey: function (data, event) {
      if (event.keyCode === 13) {
        this.login()
      } else {
        return true
      }
    },
    signUp: function () {
      router.goto('/signup')
    }
  }, el)
}
