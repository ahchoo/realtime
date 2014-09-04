var Q = require('q')
var _ = require('underscore')
var http = require('http')

var DEFAULT_OPTIONS = {
  method: 'GET',
  path: '/'
}

module.exports = function (options) {
  var deferred = Q.defer()

  options = _.clone(options)
  _.defaults(options, DEFAULT_OPTIONS)

  var req = http.request(options, function (res) {
    var data = ''

    res.on('data', function (buf) { data += buf })
    res.on('end', function () {
      deferred.resolve(data)
    })
  })

  req.on('error', function (err) {
    deferred.reject(err)
  })

  if (options.method === 'POST') {
    req.setHeader('content-type', 'application/x-www-form-urlencoded')
  }

  if (options.body) {
    req.write(options.body)
  }

  req.end()

  return deferred.promise
}
