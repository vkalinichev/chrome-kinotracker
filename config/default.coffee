pkg = require '../package'
_s = require 'underscore.string'

module.exports =

    appname: _s.dasherize pkg.name

    build: './build'
    release: './release'

#    webstoreAccount:
#        extensionId: "$extensionId"
#        clientId: "$clientId"
#        clientSecret: "$clientSecret"
#        refreshToken: "$refreshToken"