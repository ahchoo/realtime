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

gulp.task('build', function () {
  gulp
    .src(paths.entry)
    .pipe(browserify())
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
    .watch(paths.clientScripts, ['build'])
})
