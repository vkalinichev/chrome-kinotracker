pkg = require '../package'
_s = require 'underscore.string'

module.exports =

    appname: _s.underscored pkg.name

    dest: './.build'
    zip: './.zip'