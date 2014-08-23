module.exports = function () {

  var _ = require('underscore')

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')


  // User fixture

  var users = [
    {username: 'fu', password: '123'},
    {username: 'mother', password: 'fucker'}
  ]

  // clear user collection
  models.User.remove(function (err) {
    if (err) {
      console.log('Unable to clear User collection')
      return
    }

    _.forEach(users, function (user) {
      models.User.create(user).then(function resolve(user) {
        console.log('Created user:', user)
      }, function error(err) {
        console.warn('Unable to create user', err)
      })
    })

  })


  // Game fixture

  // Item fixture

}
