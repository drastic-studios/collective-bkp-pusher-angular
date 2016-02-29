'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'app' || (util.isArray(baseDir) && baseDir.indexOf('app') !== -1)) {
    routes = {
      // Should be '/bower_components': '../bower_components'
      // Waiting for https://github.com/shakyShane/browser-sync/issues/308
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    port: 9000,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'app'
  ], [
    'app/styles/**/*.css',
    'app/images/**/*',
    'app/fonts/**/*',
    'app/*.html',
    'app/scripts/**/*.html',
    'app/{scripts,bower_components}/**/*.js'
  ]);
});

gulp.task('serve:release', ['release'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:released', function () {
  browserSyncInit('dist');
});

gulp.task('serve:release:debug', ['release:debug'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', ['wiredep', 'injector:js', 'injector:css'], function () {
  browserSyncInit(['app'], null, []);
});

gulp.task('serve:e2e-dist', ['release'], function () {
  browserSyncInit('dist', null, []);
});
