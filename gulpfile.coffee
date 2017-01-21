path = require "path"
del = require "del"
fs = require "fs"

gulp = require "gulp"
pug = require "gulp-pug"
zip = require "gulp-zip"
config = require "config"
bump = require "gulp-bump"
named = require "vinyl-named"
rename = require "gulp-rename"
stylus = require "gulp-stylus"
plumber = require "gulp-plumber"
postcss = require "gulp-postcss"
sequence = require "run-sequence"
imagemin = require "gulp-imagemin"
webpackStream = require "webpack-stream"
WebStore = require "chrome-webstore-upload"

webpackConfig = require "./webpack.config"


__PROD__ = false


errorHandler = (error)->
    console.error error.message, error.stack

pad2 = ( month ) -> if month < 10 then "0" + month else month

zipName = ->
    now = new Date
    "#{ now.getFullYear() }-#{ pad2 now.getMonth()+1 }-#{ now.getDate() }.zip"


gulp.task "set-production", ( cb ) ->
    __PROD__ = true
    cb()


gulp.task "default", ["build", "watch"]

gulp.task "build", ( cb ) ->
    sequence "clean", [ "styles", "scripts", "images", "templates", "copy:resources" ], "zip"
    cb()

gulp.task "release", ( cb ) ->
    sequence "set-production", "bump", "build", "upload"
    cb()


# Prepares #

gulp.task "clean", ->
    del config.build


# Build and copying #

gulp.task "styles", ->
    gulp.src [
        "./src/styles/kinotracker.styl"
        "./src/styles/options.styl"
        "./src/styles/popup.styl"
    ]
        .pipe plumber errorHandler
        .pipe stylus { compress: __PROD__ }
        .pipe gulp.dest config.build
    

gulp.task "templates", ->
    gulp.src [
        "./src/templates/background.pug"
        "./src/templates/options.pug"
        "./src/templates/popup.pug"
    ]
        .pipe plumber errorHandler
        .pipe pug { pretty: !__PROD__ }
        .pipe gulp.dest config.build


gulp.task "clean", ->
    del config.build


gulp.task "copy", [ "copy:vendor", "copy:locales", "copy:resources" ]

gulp.task "copy:vendor", ->
    gulp.src "./src/scripts/vendor/**/*"
        .pipe gulp.dest config.build

gulp.task "copy:locales", ->
    gulp.src "./src/_locales/**/*"
        .pipe gulp.dest path.join config.build, "_locales"

gulp.task "copy:resources", ->
    gulp.src "./src/*.json"
        .pipe gulp.dest config.build


gulp.task "scripts", ["copy"], ->
    gulp.src [
        "./src/scripts/app.coffee"
        "./src/scripts/background.coffee"
        "./src/scripts/options.coffee"
    ]
        .pipe plumber errorHandler
        .pipe named()
        .pipe webpackStream webpackConfig( { production: __PROD__ } )
        .pipe gulp.dest config.build


gulp.task "images", ->
    gulp.src "./src/images/**/*"
        .pipe imagemin()
        .pipe gulp.dest path.join config.build, "images"


# Release #

gulp.task "bump", [ "bump:package.json", "bump:manifest.json"]

gulp.task "bump:package.json", ->
    gulp.src "package.json"
        .pipe bump()
        .pipe gulp.dest "./"

gulp.task "bump:manifest.json", ->
    gulp.src "./src/manifest.json"
        .pipe bump()
        .pipe gulp.dest "./src/"

gulp.task "zip", ->
    gulp.src path.join config.build, "**/*.{json,css,js,html,jpg,jpeg,png,gif}"
        .pipe zip zipName()
        .pipe gulp.dest config.release


gulp.task "upload", ->
    filename = path.join config.release, zipName()
    zipStream = fs.createReadStream filename

    WebStore config.webstoreAccount
        .uploadExisting( zipStream )
        .then ( response )->
            if response?[ "uploadState" ] is "SUCCESS"
                console.log "Upload success"
            else
                console.error "Upload failed"
        .catch ( response )->
            console.error "Upload failed:"
            console.log response


# Watch #

gulp.task "watch", ->
    gulp.watch "./src/{icons,templates,scripts}/**/*.{pug,svg}", ["templates"]
    gulp.watch "./src/scripts/**/*", ["scripts"]
    gulp.watch "./src/{icons,styles}/**/*", ["styles"]
    gulp.watch "./src/images/**/*", ["images"]
    gulp.watch "./src/*.json", ["copy:resources"]
    gulp.watch "./src/_locales/**/*", ["copy:locales"]
