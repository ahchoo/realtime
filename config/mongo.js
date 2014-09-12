var env = process.env

var connStr

if (env.OPENSHIFT_APP_NAME) {
  connStr = env.OPENSHIFT_MONGODB_DB_URL + env.OPENSHIFT_APP_NAME
} else {
  connStr = 'mongodb://admin:1234@127.0.0.1:27017/realtime'
}

module.exports = connStr
