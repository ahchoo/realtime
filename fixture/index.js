module.exports = function () {

  var _ = require('underscore')
  var md5 = require('MD5')

  // init connection
  require('../lib/connect-db')()

  var models = require('../lib/models')


  // User fixture

  initCollection('User', [
    {username: 'fu', password: md5('123')},
    {username: 'admin', password: md5('husky')}
  ])

  // Game fixture

  // Item fixture

  initCollection('Item', [
    {
      title: 'shit',
      countdown: 100,
      status: 'initialize',
      price: 100
    }, {
      title: 'fuck', // I like that
      countdown: 100,
      status: 'initialize',
      price: 75
    }
  ])


  function initCollection(name, list) {
    // clear collection first
    models[name].remove(function (err) {
      if (err) {
        console.log('Unable to clear User collection')
        return
      }

      _.forEach(list, function (obj) {
        models[name].create(obj).then(function resolve(obj) {
          console.log('Created', obj)
        }, function error(err) {
          console.warn('Unable to create document', err)
        })
      })

    })
  }

}
