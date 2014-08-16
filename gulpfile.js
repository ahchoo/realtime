var gulp = require('gulp')
var rename = require('gulp-rename')
var browserify = require('gulp-browserify')

var paths = {
  entry: 'public/js/app.js',
  scripts: 'public/js/**/*.js',
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
        }
      }
    }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('watch', function () {
  gulp
    .watch(paths.scripts, ['js'])
})
