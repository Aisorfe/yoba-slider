module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/<%= pkg.name %>.min.js': ['assets/js/jquery.min.js', 'assets/js/skel.min.js', 'assets/js/main.js']
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'assets/css',
          environment: 'production',
          outputStyle: 'expanded'
        }
      }
    },
    watch: {
      scripts: {
        files: ['assets/js/*.js'],
        tasks: ['uglify']
      },
      styles: {
        files: ['assets/sass/**/*.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'watch']);

};