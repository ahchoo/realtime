var ko = require('knockout')

var View = require('./view.js')

var item = {
  name: 'Macbook Pro Retina',
  price: 19.99
}

var me = {
  firstName: 'Sucker',
  lastName: 'Shit',
  timesLeft: 3
}

ko.applyBindings(new View({
  me: me
}))
