$(function () {
  var itemID = $('#item_id').val()
  var socket = io.connect(null, {
    query: 'itemID=' + itemID
  })
  socket.on('connect', function () {
    console.log('Connect success.')
    socket.emit('item:start:' + itemID);
  })
  socket.on('item:countdown:' + itemID, function (data) {
    console.log('item count down', data.countdown)
  })
})
