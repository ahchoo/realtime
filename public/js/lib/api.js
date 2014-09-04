var http = require('./http')
var pathToUrl = require('path-to-url')
var _ = require('underscore')

function Endpoint(name, path) {
  this.name = name
  this.path = path
}

Endpoint.prototype.create = function () {

}

Endpoint.prototype.one = function () {
}

Endpoint.prototype.list = function () {
}

Endpoint.prototype.remove = function () {
}

Endpoint.prototype.update = function () {
}

Endpoint.prototype._request = function (options) {
  var method

  if (options.method) {
    method = options.method
  } else {
    method = 'GET'
  }

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

  return http({
    path: url,
    method: method,
    body: body
  }).promise.then(function (res) {
    return JSON.parse(res)
  })
}

function encodeParams(params) {
  return _.map(params, function (value, key) {
    return key + '=' + encode(value)
  }).join('&')

  function encode(val) {
    return encodeURIComponents(val).replace('%20', '+')
  }
}


// endpoints

exports.user = new Endpoint('user', '/api/users/:userId')
exports.game = new Endpoint('game', '/api/games/:gameId')
exports.item = new Endpoint('item', '/api/items/:itemId')
