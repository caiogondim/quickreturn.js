/* global module */

module.exports = function(grunt) { "use strict";
  grunt.loadNpmTasks("grunt-contrib-uglify")

  var config = {}

  config.uglify = {
    dist: {
      options: {
        sourceMap: true
      }
    , files: {
        "dist/quickreturn.min.js": "lib/quickreturn.js"
      }
    }
  }

  grunt.initConfig(config)

  grunt.registerTask("build", ["uglify"])
}
