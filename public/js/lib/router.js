var pathToRegexp = require('path-to-regexp')

// list of routes
var routes = exports._routes = []

function Route() {
  this.keys = []
  this.regexp = /.*/
  this.url = '/'
  this.handler = null
}

Route.prototype.match = function (url) {
  var m = this.regexp.exec(url)

  if (m) {
    var params = {}

    var i
    for (i = 1; i < m.length; i++) {
      if (m[i] != null) {
        params[this.keys[i - 1].name] = m[i]
      }
    }

    return params
  }

  return null
}

Route.prototype.handle = function (url, params) {
  if (url !== window.location.pathname) {
    history.pushState(params, '', url)
  }

  if (this.handler) { this.handler(params) }
}

exports.use = function (url, handler) {
  var route = new Route()
  var regexp = pathToRegexp(url, route.keys)

  route.regexp = regexp
  route.handler = handler
  route.url = url

  routes.push(route)

  return this
}

exports.goto = function (url) {
  var i

  for (i = 0; i < routes.length; i++) {
    var route = routes[i]
    var params = route.match(url)

    if (params) {
      route.handle(url, params)

      return
    }
  }

  console.log('No match found')
}

exports.forward = function () {
  history.forward()
}

exports.back = function () {
  history.back()
}

exports.go = function (index) {
  history.go(index)
}

exports.reload = function () {
  exports.goto(window.location.pathname)
}


// window.addEventListener('onpopstate', function () {
  // console.log('pop state')
// })

window.onload = function () {
  exports.goto(window.location.pathname)
}
