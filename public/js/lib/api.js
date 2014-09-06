var pathToUrl = require('path-to-url')
var _ = require('underscore')
var q = require('q')

var http = require('./http')

function Endpoint(name, path) {
  this.name = name
  this.path = path
}

Endpoint.prototype.post = function (a1, a2) {
  var params, body

  if (a1 && a2) {
    params = a1
    body = a2
  } else if (a1) {
    body = a1
  }

  return this.request({
    method: 'POST',
    params: params,
    body: body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

Endpoint.prototype.request = function (options) {
  var deferred = q.defer()

  var method = options.method || 'GET'
  var headers = options.headers

  var url
  if (options.params) {
    url = pathToUrl(this.path, options.params)
  } else {
    url = this.path
  }

  var body
  if (options.body) {
    body = encodeParams(options.body)
  } else {
    body = ''
  }

  http({
    path: url,
    method: method,
    body: body,
    headers: headers
  }).then(function resolve(res) {
    res = JSON.parse(res)

    if (res.error) {
      deferred.reject(res.error)
    } else {
      deferred.resolve(res.data)
    }
  }, function reject(err) {
    deferred.reject(err)
  })

  return deferred.promise
}

function encodeParams(params) {
  return _.map(params, function (value, key) {
    return key + '=' + encode(value)
  }).join('&')

  function encode(val) {
    return encodeURIComponent(val).replace('%20', '+')
  }
}


// endpoints

_.forEach({
  user: '/api/users/:userId',
  game: '/api/games/:gameId',
  item: '/api/items/:itemId'
}, function (url, name) {
  exports[name] = new Endpoint(name, url)
})

var auth = new Endpoint('auth', '/api/auth')
auth.login = auth.post

exports.auth = auth
