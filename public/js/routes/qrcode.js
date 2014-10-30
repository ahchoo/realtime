ko = require('ko')

function() {
  qrcodeModel = {
    name: ko.observable(),
    join: function () {}
  }

  function updateName() {
    var form = document.createElement('form')
    form.style.display = 'none'
    form.action = url
    form.method = 'POST'
    var input = document.crewateElement('input')
    input.type = 'hidden'
    input.name = 'name'
    input.vale = qrcodeModel.name
    form.appendChild(input)
    form.submit()
  }
} ()
