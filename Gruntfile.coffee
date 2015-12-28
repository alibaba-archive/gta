module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      default:
        options: {
          bare: true
          join: true
          sourceMap: false
        }
        files: {'lib/index.js': 'src/index.coffee'}

    'http-server':
      default:
        port: 3000


  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-http-server')

  grunt.registerTask('default', ['coffee'])
  grunt.registerTask('serve', ['http-server'])
