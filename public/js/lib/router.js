var pathToRegexp = require('path-to-regexp')
var EventEmitter = require('events').EventEmitter

// Layer class

function Layer() {
  this.keys = []
  this.regexp = /.*/
  this.url = '/'
  this.handler = null
}

Layer.prototype.match = function (url) {
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

Layer.prototype.handle = function (url, params) {
  if (this.handler) { this.handler(params) }
}


// router
var router = new EventEmitter()

// list of routes
router._layers = []
router.params = {}

router.use = function (url, handler) {
  var layer = new Layer()
  var regexp = pathToRegexp(url, layer.keys)

  layer.regexp = regexp
  layer.handler = handler
  layer.url = url

  router._layers.push(layer)

  return this
}

router.goto = function (url) {
  var i

  for (i = 0; i < router._layers.length; i++) {
    var layer = router._layers[i]
    var params = layer.match(url)

    if (params) {
      router.params = params
      router.url = url

      var prevented = false

      router.emit('before change', url, params, function () {
        prevented = true
      })

      if (prevented) { return }

      history.pushState(params, '', url)

      router.emit('after change', url, params)

      layer.handle(url, params)

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

window.addEventListener('load', function () {
  router.reload()
})


module.exports = router
