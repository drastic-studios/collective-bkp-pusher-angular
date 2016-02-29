'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});
var debug = false;

gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {
  return gulp.src(['app/less/custom.less'])
    .pipe($.less({
      paths: [
        'app/bower_components',
        'app/scripts',
        'app/less'
      ]
    }))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('injector:css:preprocessor', function () {
  return gulp.src('app/less/custom.less')
    .pipe($.inject(gulp.src([
        'app/{scripts,less}/**/*.less',
        '!app/less/custom.less'
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace('app/less/', '');
        filePath = filePath.replace('app/scripts/', '../scripts/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest('app/less/'));
});

gulp.task('injector:css', ['styles'], function () {
  return gulp.src('app/index.html')
    .pipe($.inject(gulp.src([
        'app/styles/**/*.css'
      ], {read: false}), {
      ignorePath: 'app',
      addRootSlash: false
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('injector:js', ['jshint', 'injector:css'], function () {
  return gulp.src('app/index.html')
    .pipe($.inject(gulp.src([
        'app/{scripts,bower_components}/**/*.js',
        '!app/bower_components/**/*.js',
        '!app/{scripts,bower_components}/**/*.spec.js',
        '!app/{scripts,bower_components}/**/*.mock.js'
      ]).pipe($.angularFilesort()), {
      ignorePath: 'app',
      addRootSlash: false
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('partials', function () {
  return gulp.src('app/scripts/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'app',
      root: 'scripts'
    }))
    .pipe(gulp.dest('app/inject-partials/'));
});

gulp.task('copy', function () {
    return gulp.src('app/{scripts,fonts}/**/*.{eot,svg,ttf,woff,html}')
        .pipe($.copy('dist/', {prefix: 1}));
});

gulp.task('html', ['wiredep', 'copy', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('app/*.html')
    .pipe($.inject(gulp.src('app/inject-partials/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: 'app',
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    // .pipe($.ngAnnotate())
    .pipe($.uglify({
      preserveComments: $.uglifySaveLicense,
      mangle: !debug,
      output: {
        beautify: debug
      }
    }))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))
    // .pipe($.csso())
    .pipe($.cssmin())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist/'))
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src('app/**/*.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
  $.del(['dist/', '.tmp/'], done);
});

gulp.task('set-debug', function() {
  debug = true;
});
gulp.task('release', ['html', 'images', 'fonts', 'misc']);
gulp.task('release:debug', ['set-debug', 'html', 'images', 'fonts', 'misc']);
