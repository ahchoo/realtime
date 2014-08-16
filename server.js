#!/bin/env node

var express = require('express')
var path = require('path')

var app = express()

app.use('/', express.static(path.join(__dirname, '/public')))

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
           process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
           function () {
             console.log('server starting...')
           })
