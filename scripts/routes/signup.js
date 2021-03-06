var md5 = require('MD5')
var ko = require('knockout')
var cookie = require('cookie-cutter')
var location = require('global/window').location

var api = require('../lib/api')

ko.applyBindings({
  email: ko.observable(),
  name: ko.observable(),
  password: ko.observable(),
  signUp: function () {
    var email = this.email() || ''
    var name = this.name() || ''
    var password = md5(this.password()) || ''

    api.user.create({
      email: email,
      name: name,
      password: password
    }).then(function (user) {
      cookie.set('ahchoo_token', user.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })

      location.href = '/'
    })
  }
})
