$(function () {
  var itemID = $('#item_id').val()
  if (!itemID) return

  var socket = io({
    'query': 'itemID=' + itemID
  })
  socket.on('connect', function () {
    console.log('Connect success.')
    socket.emit('item:start:' + itemID);
  })
  socket.on('item:countdown:' + itemID, function (data) {
    console.log('item count down', data.countdown)
  })
})
