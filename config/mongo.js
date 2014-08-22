var _ = require('underscore')
var env = process.env

var config

if (env.OPENSHIFT_APP_NAME) {

  config = {
    database: env.OPENSHIFT_APP_NAME,
    username: env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: env.OPENSHIFT_MONGODB_DB_PASSWORD,
    host: env.OPENSHIFT_MONGODB_DB_HOST,
    port: env.OPENSHIFT_MONGODB_DB_PORT
  }

} else {

  try {
    config = require('./mongo-dev')
  } catch (e) {
    config = {}
    console.warn('Failed to read mongo-dev.js, use default db settings')
  }

  _.defaults(config, {
    database: 'realtime',
    username: 'root',
    password: '1234',
    host: '127.0.0.1',
    port: 27017
  })

}

module.exports =
  config.username + ':' +
  config.password + '@' +
  config.host + ':' +
  config.port + '/' +
  config.database
