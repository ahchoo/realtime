var env = process.env

var config

if (env.OPENSHIFT_APP_NAME) {

  config = {
    database: env.OPENSHIFT_APP_NAME,
    username: env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: env.OPENSHIFT_MONGODB_DB_PASSWORD,
    host: env.OPENSHIFT_MONGODB_DB_HOST,
    port: env.OPENSHIFT_MONGODB_DB_PORT,
    authdb: env.OPENSHIFT_APP_NAME
  }

} else {

  config = {
    database: 'realtime',
    username: 'husky',
    password: '1234',
    host: '127.0.0.1',
    port: 27017,
    authdb: 'admin'
  }

}

module.exports = config
