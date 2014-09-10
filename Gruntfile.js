/* global module */
/* jshint camelcase:false */

module.exports = function(grunt) { "use strict";
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-connect")
  grunt.loadNpmTasks("grunt-contrib-jshint")
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
      src_folders: "test"
    , jar_path: "test/selenium-server-standalone-2.42.2.jar"
    , standalone: true
    }
  }

  config.connect = {
    examples: {
      options: {
        keepalive: true
      }
    }
  , www: {
    options: {
      keepalive: true
    , base: "www"
    }
  }
  }

  config.jshint = {
    options: {
      jshintrc: true
    }
  , all: [
      "Gruntfile.js"
    , "package.json"
    , "lib/*"
    ]
  }

  grunt.initConfig(config)

  grunt.registerTask("build", ["uglify"])
  grunt.registerTask("test", ["jshint", "nightwatch"])
  grunt.registerTask("serve", ["connect"])
  grunt.registerTask("www:serve", ["connect:www"])
}
