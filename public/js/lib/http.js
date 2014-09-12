var q = require('q')
var _ = require('underscore')
var http = require('http')

var DEFAULT_OPTIONS = {
  method: 'GET',
  path: '/'
}

module.exports = function (options) {
  options = options ? _.clone(options) : {}
  _.defaults(options, DEFAULT_OPTIONS)

  var deferred = q.defer()

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

  if (options.headers) {
    _.each(options.headers, function (value, key) {
      req.setHeader(key, value)
    })
  }

  if (options.body) {
    req.write(options.body)
  }

  req.end()

  return deferred.promise
}
