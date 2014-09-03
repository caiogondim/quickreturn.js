/* global module */

module.exports = function(grunt) { "use strict";
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-connect")
  grunt.loadNpmTasks("grunt-nightwatch")

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

  config.nightwatch = {
    options: {
      src_folders: "test",
      jar_path: "test/selenium-server-standalone-2.42.2.jar",
      standalone: true,
    }
  }

  config.connect = {
    server: {
      options: {
        keepalive: true
      }
    }
  }

  grunt.initConfig(config)

  grunt.registerTask("build", ["uglify"])
  grunt.registerTask("test", ["nightwatch"])
  grunt.registerTask("serve", ["connect"])
}
