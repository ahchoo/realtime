$(function () {
  var itemID = $('#item_id').val()
  if (!itemID) return

  var socket = io({
    'query': 'itemID=' + itemID
  })
  socket.on('connect', function () {
    console.log('Connect success.')
  })
  socket.on('item:countdown:' + itemID, function (data) {
    console.log('item count down', data.countdown)

    $('#start, #restart').parent().remove()

    $('#status').text('started, end after ' + data.countdown + ' second(s)')

    if (data.countdown === 0) {
      $('#status').text('ended')
      $(document.body).append('<p><button id="restart">Restart</button></p>')
    }
  })

  // Events
  $(document.body).on('click', '#start, #restart', function () {
    socket.emit('item:start:' + itemID)
    $(this).parent().remove()
  })
})
