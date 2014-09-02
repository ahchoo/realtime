var gulp = require('gulp')
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var browserify = require('gulp-browserify')

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
  dist: 'public/dist'
}

gulp.task('build', function () {
  gulp
    .src(paths.entry)
    .pipe(browserify().on('prebundle', function (bundler) {
      bundler.require('../lib/window', {expose: 'window'})
    }))
    .pipe(rename({basename: 'app'}))
    .pipe(gulp.dest(paths.dist))

  // gulp
  //   .src('public/login/index.src.js')
  //   .pipe(browserify())
  //   .pipe(rename('index.js'))
  //   .pipe(gulp.dest('public/login/'))
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
  require('./fixture')()

  // I know it's stupid...
  setTimeout(function () {
    process.exit()
  }, 2000)
})
