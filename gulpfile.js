var gulp = require('gulp')
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var browserify = require('gulp-browserify')
var mocha = require('gulp-mocha')

var paths = {
  entry: 'public/js/index.js',
  client: {
    scripts: ['public/js/**/*.js', 'public/lib/**/*.js']
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
  gulp
    .src(paths.entry)
    .pipe(browserify())
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
    .watch(paths.client.scripts, ['build'])
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
