$(function () {
  var gameId = $('#game-id').val()
  if (!gameId) return

  var socket = io({
    'query': 'gameId=' + gameId
  })
  socket.on('connect', function () {
    console.log('Connect success.')
  })
  socket.on('game:countdown:' + gameId, function (data) {
    console.log('game count down', data.countdown)

    $('#start').parent().text('Game Started.')
    $('#countdown').text(data.countdown)

    if (data.countdown === 0) {
      window.location.reload()
    }
  })

  // Events
  $(document.body).on('click', '#start', function () {
    socket.emit('game:start:' + gameId)
    $(this).parent().text('Game Started.')
  })
})
