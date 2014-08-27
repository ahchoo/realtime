// Socket.io

module.exports = function (server, sessionStore) {

  var io = require('socket.io')
  var cookie = require('cookie')
  var connect = require('connect')
  var models = require('../models')
  var game = require('./game')

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

  sio.on('connection', function (socket) {
    game(socket, models)
  })

}
