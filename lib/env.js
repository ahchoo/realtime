// default : development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var env = exports

env.is = {
  production: false,
  development: false,
  testing: false,
  not: {
    production: true,
    development: true,
    testing: true
  }
}

env.is[process.env.NODE_ENV] = true
env.is.not[process.env.NODE_ENV] = false

if (env.is.production) {
  env.MONGO_DB_URL = process.env.OPENSHIFT_MONGODB_DB_URL
  env.APP_NAME = process.env.OPENSHIFT_APP_NAME

  env.WEB_SOCKET_URL = 'ws://realtime-ahchoo.rhcloud.com:8000'
} else {
  env.MONGO_DB_URL = 'mongodb://admin:1234@127.0.0.1:27017/'
  env.APP_NAME = 'realtime'

  env.WEB_SOCKET_URL = '127.0.0.1'
}

env.MONGO_DB_CONN_STR = env.MONGO_DB_URL + env.APP_NAME
env.SITE_SECRET = 'ahchoo web site'
