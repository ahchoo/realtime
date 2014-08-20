var gulp = require('gulp')
var rename = require('gulp-rename')
var jshint = require('gulp-jshint')
var browserify = require('gulp-browserify')

var paths = {
  entry: 'public/js/main.js',
  clientScripts: 'public/js/**/*.js',
  serverScripts: ['server.js', 'lib/**/*.js'],
  dist: 'public/dist'
}

gulp.task('js', function () {
  gulp
    .src(paths.entry)
    .pipe(browserify({
      shim: {
        knockout: {
          path: './public/lib/knockout/knockout.js',
          exports: 'ko'
        },
        'socket.io': {
          path: '/socket.io/socket.io.js',
          exports: 'io'
        }
      }
    }))
    .pipe(rename({basename: 'app'}))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('jshint', function () {
  gulp
    .src(paths.serverScripts.concat(paths.clientScripts))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('watch', function () {
  gulp
    .watch(paths.clientScripts, ['js'])
})
