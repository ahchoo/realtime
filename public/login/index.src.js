var md5 = require('MD5')
var http = require('http')
var ko = require('knockout')

ko.applyBindings({
  username: ko.observable(),
  password: ko.observable(),
  login: function () {
    var username = this.username()
    var password = md5(this.password())

    var req = http.request({
      method: 'post',
      path: '/api/auth'
    }, function (res) {
      var data = ''

      res.on('data', function (buf) {
        data += buf
      })

      res.on('end', function () {
        data = JSON.parse(data)

        if (data.error) {
          window.alert(data.error.message)
        } else {
          window.alert('login succeed')
        }
      })
    })

    req.setHeader('content-type', 'application/x-www-form-urlencoded')
    req.write('username=' + username + '&password=' + password)

    req.end()
  }
})
