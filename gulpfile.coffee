gulp = require "gulp"
del = require "del"
path = require "path"

named = require "vinyl-named"


$ = require("gulp-load-plugins")()
config = require "config"

webpackStream = require "webpack-stream"
webpackConfig = require "./webpack.config"

postcssImportanter = require "postcss-importanter"

errorHandler = (error)->
    console.error error.message, error.stack


gulp.task "default", ["build", "watch"]

gulp.task "build", $.sequence "clean", [ "styles", "scripts", "images", "templates", "copy:resources" ], "zip"


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


gulp.task "zip", ->
    date = new Date
    gulp.src path.join config.dest, "**/*.{json,css,js,jpg,jpeg,png,gif}"
        .pipe $.zip( "#{date.getFullYear()}-#{date.getMonth()}-#{date.getDate()}.zip" )
        .pipe gulp.dest config.zip


gulp.task "watch", ->
    gulp.watch "./src/{icons,templates}/**/*", ["templates"]
    gulp.watch "./src/scripts/**/*", ["scripts"]
    gulp.watch "./src/{icons,styles}/**/*",  ["styles"]
    gulp.watch "./src/images/**/*",  ["images"]
    gulp.watch "./src/*.json", ["copy:resources"]
    gulp.watch "./src/_locales/**/*", ["copy:locales"]
