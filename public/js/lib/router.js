var pathToRegexp = require('path-to-regexp')

var router = exports

// list of routes
router._routes = []

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

router.use = function (url, handler) {
  var route = new Route()
  var regexp = pathToRegexp(url, route.keys)

  route.regexp = regexp
  route.handler = handler
  route.url = url

  router._routes.push(route)

  return this
}

router.goto = function (url) {
  var i

  for (i = 0; i < router._routes.length; i++) {
    var route = router._routes[i]
    var params = route.match(url)

    if (params) {
      route.handle(url, params)

      return
    }
  }

  console.log('No match found')
}

router.forward = function () {
  history.forward()
}

router.back = function () {
  history.back()
}

router.go = function (index) {
  history.go(index)
}

router.reload = function () {
  router.goto(window.location.pathname)
}


window.addEventListener('popstate', function () {
  router.reload()
})

window.onload = function () {
  router.reload()
}
