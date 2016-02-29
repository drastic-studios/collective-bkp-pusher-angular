'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      exclude: [/bootstrap\.js/, /bootstrap\.css/]
    }))
    .pipe(gulp.dest('app'));
});
