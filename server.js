#!/bin/env node

var fs = require('fs')
var http = require('http')
var https = require('https')
var privateKey = fs.readFileSync('sslcert/server.key', 'utf-8')
var certificate = fs.readFileSync('sslcert/server.crt', 'utf-8')
var app = require('./app')
var server = http.createServer(app)
var httpsServer = https.createServer({
  key: privateKey,
  cert: certificate
}, app)

server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
              process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
              function () {
                console.log('Server started')
              })

httpsServer.listen(8081, process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1', function () {
  console.log('Https Server started')
})

require('./lib/socket')(server, app.sessionStore)
