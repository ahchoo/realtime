var pathToUrl = require('path-to-url')
var _ = require('underscore')
var q = require('q')

var http = require('./http')

function Endpoint(name, path) {
  this.name = name
  this.path = path
}

Endpoint.prototype.get = function (params) {
  return this.request({
    method: 'GET',
    params: params
  })
}

_.forEach(['post', 'update', 'patch', 'delete', 'put'], function (method) {

  Endpoint.prototype[method] = function (a1, a2) {
    var params, body

    if (a1 && a2) {
      params = a1
      body = a2
    } else if (a1) {
      body = a1
    }

    return this.request({
      method: method.toUpperCase(),
      params: params,
      body: body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

})


Endpoint.prototype.request = function (options) {
  var deferred = q.defer()

  options.params = options.params || {}
  options.body = options.body || {}

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
  user: '/api/users/:id?',
  game: '/api/games/:id?',
  item: '/api/items/:id?'
}, function (url, name) {
  var resource = new Endpoint(name, url)

  // alias
  resource.list = resource.get
  resource.one = resource.get
  resource.remove = resource.delete
  resource.create = resource.post

  exports[name] = resource
})

var auth = exports.auth = new Endpoint('auth', '/api/auth')
auth.login = auth.post

var db = exports.db = new Endpoint('db', '/api/db/:action')

db.reset = function () {
  return this.post({action: 'reset'}, {})
}

var start = exports.start = new Endpoint('start', '/api/games/:id/start')

exports.start.startGame = function (gameId) {
  return this.get({id: gameId}, {})
}
