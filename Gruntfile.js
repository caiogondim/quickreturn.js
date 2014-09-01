module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-uglify");

  var config = {};

  config.uglify = {
    dist: {
      options: {
        sourceMap: true
      },
      files: {
        "dist/quickreturn.min.js": "lib/quickreturn.js"
      }
    }
  };

  grunt.initConfig(config);
};
