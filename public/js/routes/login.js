module.exports = function (el) {
  var md5 = require('MD5')
  var http = require('../lib/http')
  var ko = require('knockout')
  var cookie = require('cookie-cutter')

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
        res = JSON.parse(res)

        if (res.error) {
          window.alert(res.error.message)
          return
        }

        window.alert('login succeed')
        cookie.set('ahchoo_token', res.data.token, {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)})
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
