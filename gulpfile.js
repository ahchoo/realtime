var gulp = require('gulp')
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var browserify = require('gulp-browserify')
var mocha = require('gulp-mocha')

var paths = {
  entry: 'public/js/main.js',
  client: {
    scripts: 'public/js/**/*.js'
  },
  server: {
    scripts: [
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

  gulp
    .src('public/login/index.src.js')
    .pipe(browserify())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('public/login/'))
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
    .watch(paths.clientScripts, ['build'])
})

gulp.task('initdb', function () {
  require('./fixture')(function () {
    require('mongoose').disconnect()
  })
})

gulp.task('test', function () {
  gulp
    .src(paths.test)
    .pipe(mocha({
      timeout: 5000
    }))
})
