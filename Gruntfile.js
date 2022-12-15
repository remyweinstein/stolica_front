module.exports = function(grunt) {

    grunt.initConfig({
  
      watch: {
        sass: {
          files: '**/*.scss',
          tasks: ['css'],
          options: {
            livereload: 35729
          }
        },
        js: {
          files: ['src/js/stolica.js', 'src/js/instock.js', 'src/js/menu.js', 'src/js/banner.js', 'src/js/slider.js', 'src/js/app.js'],
          tasks: ['js']
        },
        all: {
          files: ['**/*.html'],
          tasks: ['copy'],
          options: {
            livereload: true
          }
        }
      },
  
      concat: {
        options: {
          separator: '\n/*next file*/\n\n'
        },
        dist: {
          src: ['src/js/stolica.js', 'src/js/instock.js', 'src/js/menu.js', 'src/js/banner.js', 'src/js/slider.js', 'src/js/app.js'],
          dest: 'build/js/built.js'
        }
      },

      copy: {
        main: {
          files: [
            {expand: true, cwd: 'src/', src: ['**/*.html', '**/*.png'], dest: 'build/'},
          ],
        },
      },
  
      uglify: {
        build: {
          files: {
            'build/js/built.min.js': ['build/js/built.js']
          }
        }
      },
  
      cssmin: {
       build: {
        src: 'build/css/main.css',
        dest: 'build/css/main.min.css'
       }
      },
  
      sass: {
       dev: {
        files: {
          'build/css/main.css': 'src/scss/main.scss'
        }
       }
      }
    });
  
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('copy', ['copy']);
    grunt.registerTask('css', ['sass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'uglify']);
  
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
  
  };