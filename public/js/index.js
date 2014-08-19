var ko = require('knockout')
var PersonView = require('./model/person')

var participants = ko.observableArray()

ko.applyBindings({participants: participants})

function addParticipant(person) {
  participants.push(new PersonView(person))
}

var socket = io.connect()
socket.on('enter-room', addParticipant)
