module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // jshint: {
    //   all: ['Gruntfile.js', 'server/**/*.js', 'client/**/*.js']
    // },
    karma: {
      unit:{
        configFile: 'karma.conf.js'
      }
    },
    watch: {
      react: {
        files: 'client/**/*.jsx',
        tasks: ['browserify']
      }
    },
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      client: {
        src: ['client/**/*.jsx'],
        dest: 'client/build.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma', 'browserify']);

};
