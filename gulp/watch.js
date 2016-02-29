'use strict';

var gulp = require('gulp');

gulp.task('watch', ['styles', 'injector:css', 'injector:js'] ,function () {
  // gulp.watch('app/styles/**/*.css', ['injector:css']);
  gulp.watch('app/{less,scripts}/**/*.less', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['injector:js']);
  // gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
