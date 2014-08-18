$(function () {
    var socket = io.connect()

    socket.on('connect_failed', function (reason) {
        console.error('Unable to Connect: ', reason)
    }).on('connect', function () {
        console.log('Connect success.')
    })
})