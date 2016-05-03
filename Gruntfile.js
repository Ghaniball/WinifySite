// Generated on 2014-05-14 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: '../WinifyDist/dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/views/**',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9010,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],
          // MODIFIED: Add this middleware configuration
          middleware: function(connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite([
              '^/de|en/(.*) /$1',
              '^[^\\.]*$ /index.html [L]'
            ])); //Matches everything that does not contain a '.' (period)
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      snapshot: {
        options: {
          port: 9011,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],
          middleware: function(connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/jquery.themepunch.*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }],
        options: {
          force: true
        }
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'ff 24', 'opera 12.1', 'ie 8', 'ie 9']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/*.{scss,sass}'],
        ignorePath: '<%= yeoman.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        loadAll: '<%= yeoman.app %>/bower_components/gumby/sass/extensions',
        relativeAssets: true,
        force: true,
        lineComments: false,
        debugInfo: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: false
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist%>/views/{,*/}{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist%>/images']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        //root: '<%= yeoman.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '*.xml',
            '*.php',
            'templates/{,*/}*.html',
            'views/{,*/}*.html',
            '!views/home/*.html',
            'images/{,*/}*.{webp}',
            'fonts/**'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/../',
          src: ['app_php/**', 'composer.json', 'composer.lock', 'composer.phar'],
          dest: '<%= yeoman.dist %>/../'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/gumby/js/libs',
          src: ['jquery.mobile.custom.min.js'],
          dest: '<%= yeoman.dist %>/js/libs'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/../',
          src: ['snapshots/**'],
          dest: '<%= yeoman.dist %>/../'
        }]
      },
      case: {
        expand: true,
        cwd: '<%= yeoman.app %>/views',
        dest: '.tmp/case/',
        src: 'home.html'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      server: {
        expand: true,
        cwd: '<%= yeoman.app %>/bower_components/gumby/js/libs',
        src: ['jquery.mobile.custom.min.js'],
        dest: '.tmp/js/libs'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Configuration to be run (and then tested).
    nginclude: {
      dist: {
        options: {
          assetsDirs: ['<%= yeoman.app %>'],
          cheerioOpts: {
            decodeEntities: false
          },
          prependAttrs: 'data-',
          filterTags: '[data-replace-ng-include]',
          useWrapComments: false,
          attrs2Remove: ['data-replace-ng-include']
        },
        files: {
          '<%= yeoman.dist %>/views/home.html': ['<%= yeoman.app %>/views/home.html']
        }
      }
    },
    htmlSnapshot: {
      all: {
        options: {
          snapshotPath: '<%= yeoman.dist %>/snapshots/',
          sitePath: 'http://winify.com/',
          fileNamePrefix: '',
          msWaitForPages: 2000,
          removeScripts: true,
          removeComments: true,
          //removeStyleTags: true,
          //removeStyleAttrs: true,
          replaceStrings: [
            {'<html ': '<!DOCTYPE html><html '}
          ],
          sanitize: function (requestUri) {
            console.log('uri: ' + requestUri);
            if (/\/$/.test(requestUri)) {
              return requestUri + 'index';
            } else {
              return requestUri;
            }
          },
          urls: [
            'de/',
            'de/datenschutz',
            'de/impressum',
            'de/agb',
            'en/',
            'en/datenschutz',
            'en/impressum',
            'en/agb'
          ]
        }
      }
    },
    exec: {
      gitadd: {
        cwd: '<%= yeoman.dist %>/../',
        cmd: 'git add --all .'
      },
      gitcommit: {
        cwd: '<%= yeoman.dist %>/../',
        cmd: 'git commit -m"Auto deploy"'
      },
      gitpush: {
        cwd: '<%= yeoman.dist %>/../',
        cmd: 'git push origin'
      }
    },
    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([/*'build', */'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'copy:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('seoSnapshot', [
    'clean:server',
    'connect:snapshot',
    'htmlSnapshot'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'nginclude:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'/*,
    'htmlSnapshot',
    'exec'*/
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    //'test',
    'build'
  ]);
};
