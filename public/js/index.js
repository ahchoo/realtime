var ko = require('knockout')
var io = require('socket.io-client')

var PersonView = require('./model/person')

var participants = ko.observableArray()

ko.applyBindings({participants: participants})

function addParticipant(person) {
  participants.push(new PersonView(person))
}

var currentUri = window.location.href

var socket

// need different config for local and production env
if (currentUri.indexOf('127.0.0.1') !== -1 ||
    currentUri.indexOf('localhost') !== -1) {
  socket = io.connect()
} else {
  socket = io.connect('ws://realtime-ahchoo.rhcloud.com:8000')
}

socket.on('enter-room', addParticipant)
