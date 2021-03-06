/* global module */
/* jshint camelcase:false */

module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-connect")
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-nightwatch")
  grunt.loadNpmTasks("grunt-rsync-2")
  grunt.loadNpmTasks("grunt-jscs")

  var allJSFiles = [
    "Gruntfile.js",
    "src/*"
  ]

  var config = {}

  config.pkg = grunt.file.readJSON("package.json")

  config.uglify = {
    dist: {
      options: {
        sourceMap: true,
        banner:
          "/*!\n" +
          "  quickreturn.js v<%= pkg.version %>\n" +
          "  http://quickreturnjs.caiogondim.com\n" +
          "*/"
      },
      files: {
        "dist/quickreturn.min.js": "src/quickreturn.js"
      }
    }
  }

  // config.nightwatch = {
  //   options: {
  //     src_folders: "test",
  //     jar_path: "test/selenium-server-standalone-2.42.2.jar",
  //     standalone: true
  //   }
  // }

  config.connect = {
    examples: {
      options: {
        keepalive: true
      }
    },
    www: {
      options: {
        keepalive: true,
        base: "www"
      }
    }
  }

  config.jshint = {
    options: {
      jshintrc: true
    },
    all: allJSFiles
  }

  config.jscs = {
    src: allJSFiles,
    options: {
      config: ".jscsrc"
    }
  }

  config.rsync = {
    deploy: {
      files: "www/",
      options: {
        host: "caiogondim.com",
        remoteBase: "~/quickreturnjs.caiogondim.com/"
      }
    }
  }

  grunt.initConfig(config)

  grunt.registerTask("build", ["uglify"])
  grunt.registerTask("test", ["jshint", "jscs"])
  grunt.registerTask("serve", ["connect"])
  grunt.registerTask("www:serve", ["connect:www"])
  grunt.registerTask("www:deploy", ["rsync"])
}
