$(function () {
  var gameId = $('#game-id').val()
  if (!gameId) return

  var socket = io({
    'query': 'gameId=' + gameId
  })
  socket.on('connect', function () {
    console.log('Connect success.')
  })

  socket.on('game:start:' + gameId, function (countdown) {
    $('#start').parent().text('Game Started.')
    var tId = setInterval(function () {
      $('#countdown').text(countdown)
      countdown--
      if (countdown < 0) {
        clearInterval(tId)
      }
    }, 1000)
  })

  socket.on('game:end:' + gameId, function () {
    window.location.reload()
  })

  // Events
  $(document.body).on('click', '#start', function () {
    socket.emit('game:start:' + gameId)
    $(this).parent().text('Game Started.')
  })
})
