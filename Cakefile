fs = require 'fs'
{exec} = require 'child_process'

task 'build', 'build the source code to javascript', (options) ->
  exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
    throw err if err
    console.log 'build process complete without error, chekcout lib directory'