var ko = require('knockout')
var io = require('socket.io-client')

var PersonView = require('./model/person')

var participants = ko.observableArray()

ko.applyBindings({participants: participants})

function addParticipant(person) {
  participants.push(new PersonView(person))
}

var socket = io.connect('ws://realtime-ahchoo.rhcloud.com:8000')
socket.on('enter-room', addParticipant)
