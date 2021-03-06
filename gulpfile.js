var gulp = require('gulp')
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var browserify = require('gulp-browserify')
var mocha = require('gulp-mocha')

var paths = {
  entry: 'public/js/index.js',
  client: {
    scripts: ['scripts/**/*.js']
  },
  server: {
    scripts: [
      'app.js',
      'server.js',
      'lib/**/*.js',
      'config/**/*.js',
      'fixture/**/*.js'
    ]
  },
  dist: 'public/dist',
  test: 'test/**/*.spec.js'
}

gulp.task('build', function () {
  (function (callback) {
    [
      'login.js',
      'logout.js',
      'signup.js',
      'game.js'
    ].forEach(function (file) {
      gulp
        .src('scripts/routes/' + file)
        .pipe(browserify())
        .pipe(gulp.dest('public/js/routes'))
    })
    callback()
  })(function () {
    [
      'game.js',
      'login.js',
      'logout.js'
    ].forEach(function (file) {
      gulp
        .src('scripts/routes/manage/' + file)
        .pipe(browserify())
        .pipe(gulp.dest('public/js/routes/manage'))
    })
  })
})

gulp.task('build:watch', function () {
  gulp
    .src(paths.entry)
    .pipe(browserify())
    .on('error', function (err) {
      console.log(err.stack)
      this.emit('end')
    })
    .pipe(rename({basename: 'app'}))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('lint', function () {
  gulp
    .src(paths.server.scripts.concat(paths.client.scripts))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('watch', function () {
  gulp
    .watch(paths.client.scripts, ['build:watch'])
})

gulp.task('initdb', function () {
  require('./fixture')().then(function () {
    require('mongoose').disconnect()
  })
})

gulp.task('dropdb', function () {
  require('./lib/connect-db')().then(function () {
    require('mongoose').connection.db.dropDatabase()
    require('mongoose').disconnect()
    console.log('database droped')
  })
})

gulp.task('test', function () {
  process.env.NODE_ENV = 'testing'

  require('mockgoose')(require('mongoose'))

  gulp
    .src(paths.test)
    .pipe(mocha({
      timeout: 5000
    }))
})
