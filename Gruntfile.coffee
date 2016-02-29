'use strict'

#  # Globbing
#  for performance reasons we're only matching one level down:
#  'test/spec/{,*/}*.js'
#  use this if you want to recursively match all subfolders:
#  'test/spec/**/*.js'

module.exports = (grunt) ->

  # Load grunt tasks automatically
  (require 'load-grunt-tasks') grunt

  # Time how long tasks take. Can help when optimizing build times
  (require 'time-grunt') grunt

  # Define the configuration for all the tasks
  grunt.initConfig

    # Project settings
    yeoman:
      # configurable paths
      app: require('./bower.json').appPath || 'app'
      dist: 'dist'

    # Watches files for changes and runs tasks based on the changed files
    watch:
      bower:
        files: ['bower.json']
        tasks: ['wiredep']
      js:
        files: ['<%= yeoman.app %>/scripts/{,*/}*.*']
        # tasks: ['newer:jshint:all']
        options:
          livereload: true
      jsTest:
        files: ['test/spec/{,*/}*.js']
        # tasks: ['newer:jshint:test', 'karma']
      less:
        files: [
          'app/less/**/*.less'
          'app/bower_components/bootstrap/less/*.less'
          'less/*.less']
        tasks: ['less']
        options:
          livereload: true
      styles:
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css'
          '!<%= yeoman.app %>/styles/custom.css'
        ]
        # tasks: ['newer:copy:styles', 'autoprefixer']
        options:
          livereload: true
      gruntfile:
        files: ['Gruntfile.coffee']
      livereload:
        options:
          livereload: '<%= connect.options.livereload %>'
        files: [
          '<%= yeoman.app %>/{,*/}*.html'
          '.tmp/styles/{,*/}*.css'
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}' ]

    # Compile less files
    less:
      options:
        ieCompat: false
      src:
        files:
          'app/styles/custom.css': 'app/less/custom.less'
    
    # The actual grunt server settings
    connect:
      options:
        port: 9000
        # Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
        livereload: 35729
      livereload:
        options:
          open: true
          base: ['<%= yeoman.app %>']
      test:
        options:
          port: 9001
          base: [
            '.tmp'
            'test'
            '<%= yeoman.app %>']
      dist:
        options:
          open: true
          base: '<%= yeoman.dist %>'

    # Make sure code styles are up to par and there are no obvious mistakes
    jshint:
      options:
        jshintrc: '.jshintrc'
        reporter: require 'jshint-stylish'
      all: [
        'Gruntfile.coffee'
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
      test:
        options:
          jshintrc: 'test/.jshintrc'
        src: ['test/spec/{,*/}*.js']

    # Empties folders to start fresh
    clean:
      dist:
        files: [
          dot: true
          src: [
            '.tmp'
            '<%= yeoman.dist %>/*'
            '!<%= yeoman.dist %>/.git*']
        ]
      server: '.tmp'

    # Add vendor prefixed styles
    autoprefixer:
      options:
        browsers: ['last 1 version']
      dist:
        files: [
          expand: true
          cwd: '.tmp/styles/'
          src: '{,*/}*.css'
          dest: '.tmp/styles/'
        ]

    # Automatically inject Bower components into the app
    wiredep:
      app:
        src: ['<%= yeoman.app %>/index.html']
        ignorePath: /\.\.\//

    # Renames files for browser caching purposes
    filerev:
      dist:
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js'
          '<%= yeoman.dist %>/styles/{,*/}*.css'
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          '<%= yeoman.dist %>/fonts/*'
        ]

    # Reads HTML for usemin blocks to enable smart builds that automatically
    # concat, minify and revision files. Creates configurations in memory so
    # additional tasks can operate on them
    useminPrepare:
      html: '<%= yeoman.app %>/index.html'
      options:
        dest: '<%= yeoman.dist %>'
        flow:
          html:
            steps:
              js: ['concat', 'uglifyjs']
              css: ['cssmin']
            post: {}


    # Performs rewrites based on rev and the useminPrepare configuration
    usemin:
      html: ['<%= yeoman.dist %>/{,*/}*.html']
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
      options:
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']

    # The following *-min tasks will produce minified files in the dist folder
    # By default, your `index.html`'s <!-- Usemin block --> will take care of
    # minification. These next options are pre-configured if you do not wish
    # to use the Usemin blocks.
    # cssmin: {
    #   dist: {
    #     files: {
    #       '<%= yeoman.dist %>/styles/main.css': [
    #         '.tmp/styles/{,*/}*.css'
    #       ]
    #     }
    #   }
    # },
    # uglify: {
    #   dist: {
    #     files: {
    #       '<%= yeoman.dist %>/scripts/scripts.js': [
    #         '<%= yeoman.dist %>/scripts/scripts.js'
    #       ]
    #     }
    #   }
    # },
    # concat: {
    #   dist: {}
    # },

    imagemin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/images'
          src: '{,*/}*.{png,jpg,jpeg,gif}'
          dest: '<%= yeoman.dist %>/images'
        ]

    svgmin:
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.app %>/images'
          src: '{,*/}*.svg'
          dest: '<%= yeoman.dist %>/images'
        ]

    htmlmin:
      dist:
        options:
          collapseWhitespace: true
          collapseBooleanAttributes: true
          removeCommentsFromCDATA: true
          removeOptionalTags: true
        files: [
          expand: true
          cwd: '<%= yeoman.dist %>'
          src: ['*.html', '{,*/}*.html']
          dest: '<%= yeoman.dist %>'
        ]

    # Replace Google CDN references
    cdnify:
      dist:
        html: ['<%= yeoman.dist %>/*.html']

    # Copies remaining files to places other tasks can use
    copy:
      dist:
        files: [{
          expand: true
          dot: true
          cwd: '<%= yeoman.app %>'
          dest: '<%= yeoman.dist %>'
          src: [
            '*.{ico,png,txt}'
            '.htaccess'
            '*.html'
            'scripts/{,*/}*.html'
            'images/{,*/}*.{webp}'
            'fonts/{,*/}*.*']}
        {
          expand: true
          cwd: '.tmp/images'
          dest: '<%= yeoman.dist %>/images'
          src: ['generated/*']}
        ]
      styles:
        expand: true
        cwd: '<%= yeoman.app %>/styles'
        dest: '.tmp/styles/'
        src: '{,*/}*.css'

    # Run some tasks in parallel to speed up the build process
    concurrent:
      server: ['copy:styles']
      test: ['copy:styles']
      dist: [
        'copy:styles'
        'imagemin'
        'svgmin']

    # Test settings
    karma:
      unit:
        configFile: 'karma.conf.coffee'
        singleRun: true

    html2js:
      options:
        base: 'app'
        module: 'app.templates'
        singleModule: true
        useStrict: true
        htmlmin:
          collapseBooleanAttributes: true
          collapseWhitespace: true
          removeAttributeQuotes: true
          removeComments: true
          removeEmptyAttributes: true
          removeRedundantAttributes: true
          removeScriptTypeAttributes: true
          removeStyleLinkTypeAttributes: true
      main:
        src: ['app/views/**/*.html']
        dest: 'app/scripts/core/populate.template.cache.js'

  grunt.registerTask 'serve',  (target) ->
    if target == 'release'
      grunt.task.run ['release', 'connect:dist:keepalive']
    else if target == 'released'
      grunt.task.run ['connect:dist:keepalive']
    else
      grunt.task.run [
        'clean:server'
        'wiredep'
        'concurrent:server'
        # 'autoprefixer'
        'less'
        'connect:livereload'
        'watch']

  grunt.registerTask 'server', (target) ->
    grunt.log.warn 'The `server` task has been deprecated. Use `grunt serve` to start a server.'
    grunt.task.run ['serve:' + target]

  grunt.registerTask 'test', [
    'clean:server'
    'concurrent:test'
    # 'autoprefixer'
    'less'
    'connect:test'
    'karma']

  grunt.registerTask 'release', [
    'clean:dist'
    'wiredep'
    'useminPrepare'
    'concurrent:dist'
    # 'autoprefixer'
    # 'html2js:main'
    'less'
    'concat'
    'copy:dist'
    'cdnify'
    'cssmin'
    'uglify'
    'filerev'
    'usemin'
    'htmlmin'
    ]

  grunt.registerTask 'default', [
    'newer:jshint'
    'test'
    'release']
