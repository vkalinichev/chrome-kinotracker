gulp = require "gulp"
del = require "del"
path = require "path"
WebStore = require "chrome-webstore-upload"
fs = require "fs"
_s = require "underscore.string"

named = require "vinyl-named"

$ = require("gulp-load-plugins")()
config = require "config"

webpackStream = require "webpack-stream"
webpackConfig = require "./webpack.config"

postcssImportanter = require "postcss-importanter"

errorHandler = (error)->
    console.error error.message, error.stack

zipName = ->
    date = new Date
    "#{ date.getFullYear() }-#{ _s.pad date.getMonth()+1, 2, "0" }-#{ date.getDate() }.zip"



# Main Aliases #

gulp.task "default", ["build", "watch"]

gulp.task "build", $.sequence "clean", [ "styles", "scripts", "images", "templates", "copy:resources" ], "zip"

gulp.task "release", $.sequence "bump", "build", "upload"



# Prepares #

gulp.task "clean", ->
    del config.dest



# Build and copying #

gulp.task "styles", ->
    gulp.src [
        "./src/styles/kinotracker.styl"
        "./src/styles/options.styl"
        "./src/styles/popup.styl"
    ]
        .pipe $.plumber errorHandler
        .pipe $.stylus { compress: true }
        .pipe $.postcss [ postcssImportanter ]
        .pipe gulp.dest config.dest
    
gulp.task "templates", ->
    gulp.src [
        "./src/templates/background.jade"
        "./src/templates/options.jade"
        "./src/templates/popup.jade"
    ]
        .pipe $.plumber errorHandler
        .pipe $.jade { pretty: false }
        .pipe gulp.dest config.dest


gulp.task "clean", ->
    del config.dest


gulp.task "copy", [ "copy:vendor", "copy:locales", "copy:resources" ]

gulp.task "copy:vendor", ->
    gulp.src "./src/scripts/vendor/**/*"
        .pipe gulp.dest config.dest

gulp.task "copy:locales", ->
    gulp.src "./src/_locales/**/*"
        .pipe gulp.dest path.join config.dest, "_locales"

gulp.task "copy:resources", ->
    gulp.src "./src/*.json"
        .pipe gulp.dest config.dest


gulp.task "scripts", ["copy"], ->
    gulp.src [
        "./src/scripts/app.coffee"
        "./src/scripts/background.coffee"
        "./src/scripts/options.coffee"
    ]
        .pipe $.plumber errorHandler
        .pipe named()
        .pipe webpackStream webpackConfig
        .pipe gulp.dest config.dest


gulp.task "images", ->
    gulp.src "./src/images/**/*"
        .pipe $.imagemin()
        .pipe gulp.dest path.join config.dest, "images"



# Release #

gulp.task "bump", [ "bump:package.json", "bump:manifest.json"]


gulp.task "bump:package.json", ->
    gulp.src "package.json"
        .pipe $.bump()
        .pipe gulp.dest "./"


gulp.task "bump:manifest.json", ->
    gulp.src "./src/manifest.json"
        .pipe $.bump()
        .pipe gulp.dest "./src/"


gulp.task "zip", ->
    gulp.src path.join config.dest, "**/*.{json,css,js,jpg,jpeg,png,gif}"
        .pipe $.zip zipName()
        .pipe gulp.dest config.zip

gulp.task "upload", ->
    filename = path.join config.zip, zipName()
    zipStream = fs.createReadStream filename

    webStore = WebStore config.webstoreAccount
    webStore
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
    gulp.watch "./src/{icons,templates}/**/*", ["templates"]
    gulp.watch "./src/scripts/**/*", ["scripts"]
    gulp.watch "./src/{icons,styles}/**/*",  ["styles"]
    gulp.watch "./src/images/**/*",  ["images"]
    gulp.watch "./src/*.json", ["copy:resources"]
    gulp.watch "./src/_locales/**/*", ["copy:locales"]
