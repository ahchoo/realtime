var md5 = require('MD5')
var ko = require('knockout')
var cookie = require('cookie-cutter')
var window = require('global/window')

var location = window.location

var api = require('../../lib/api')

ko.applyBindings({
  email: ko.observable(),
  password: ko.observable(),
  login: function () {
    var email = this.email()
    var password = md5(this.password())

    api.manageAuth.login({
      email: email,
      password: password
    }).then(function (user) {
      var oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      cookie.set('ahchoo_token', user.token, {expires: oneMonth})
      cookie.set('ahchoo_user_id', user._id, {expires: oneMonth})

      location.href = '/manage'
    })
  },
  loginByKey: function (data, event) {
    if (event.keyCode === 13) {
      this.login()
    } else {
      return true
    }
  }
})
