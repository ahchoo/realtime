#!/bin/env node

var http = require('http')
var app = require('./app')
var server = http.createServer(app)
server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
              process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
              function () {
                console.log('Server started')
              })

require('./lib/socket')(server, app.sessionStore)
