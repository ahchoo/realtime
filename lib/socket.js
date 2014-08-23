// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('./models')

  var sio = io.listen(server)

  sio.use(function (socket, next) {
    var data = socket.request
    if (!data.headers.cookie) {
      next(new Error('Session cookie required.'))
    } else {
      data.cookie = connect.utils.parseSignedCookies(cookie.parse(data.headers.cookie), process.env.AHCHOO_SITE_SECRET)
      data.sessionID = data.cookie['express.sid']
      sessionStore.get(data.sessionID, function (err, session) {
        if (err) {
          next(new Error('Error in session store.'))
        } else if (!session) {
          next(new Error('Session not found.'))
        } else {
          data.session = session
          next()
        }
      })
    }
  })

  sio.sockets.on('connection', function (socket) {
    // TODO use the private '_query'
    var itemID = socket.request._query.itemID
    if (!itemID) return

    socket.on('item:start:' + itemID, function () {
      models.Item.findById(itemID, function (err, item) {

        if (!item || item.status === 'started') return

        item.status = 'started'
        console.log('item:countdown:start', itemID)
        var tId = setInterval(function () {
          console.log('item:countdown:counting', itemID, item.countdown)
          socket.broadcast.emit('item:countdown:' + itemID, {
            countdown: item.countdown
          })
          socket.emit('item:countdown:' + itemID, {
            countdown: item.countdown
          })
          item.countdown--
          if (item.countdown < 0) {
            clearInterval(tId)
            item.status = 'ended'
            item.countdown = 100
            console.log('item:countdown:end', itemID)
          }
        }, 1000)

      })
    })
  })

}
