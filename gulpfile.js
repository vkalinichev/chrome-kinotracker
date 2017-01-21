const path = require( 'path' )
const del = require( 'del' )
const fs = require( 'fs' )

const gulp = require( 'gulp' )
const pug = require( 'gulp-pug' )
const zip = require( 'gulp-zip' )
const config = require( 'config' )
const bump = require( 'gulp-bump' )
const named = require( 'vinyl-named' )
const rename = require( 'gulp-rename' )
const stylus = require( 'gulp-stylus' )
const plumber = require( 'gulp-plumber' )
const postcss = require( 'gulp-postcss' )
const sequence = require( 'run-sequence' )
const imagemin = require( 'gulp-imagemin' )
const webpackStream = require( 'webpack-stream' )
const WebStore = require( 'chrome-webstore-upload' )

const webpackConfig = require( './webpack.config.js' )

let __PROD__ = false

const errorHandler = (error) => console.error( error.message, error.stack )
const pad2 = month => month < 10 ? "0" + month : month
const zipName = ()=> {
    const now = new Date
    return `${ now.getFullYear() }-${ pad2( now.getMonth() + 1 ) }-${ now.getDate() }.zip`
}

gulp.task( 'set-production', cb => {
    __PROD__ = true
    cb()
})

gulp.task( "default", ["build", "watch"] )

gulp.task( "build", cb => {
    sequence( "clean", [ "styles", "scripts", "images", "templates" ], "zip" )
    cb()
})

gulp.task( "release", cb => {
    sequence( "set-production", "bump", "build", "upload" )
    cb()
} )

gulp.task( "clean", () =>
    del( path.join( config.build, '*.{css,html,js,map}' ) )
)

gulp.task( "styles", () =>
    gulp.src( "./src/styles/*.styl" )
        .pipe( plumber( errorHandler ))
        .pipe( stylus({ compress: __PROD__ }))
        .pipe( gulp.dest( config.build ))
)
    
gulp.task( "templates", () =>
    gulp.src( "./src/templates/*.pug" )
        .pipe( plumber( errorHandler ))
        .pipe( pug( { pretty: !__PROD__ } ))
        .pipe( gulp.dest( config.build ))
)

gulp.task( "scripts", () =>
    gulp.src( "./src/scripts/*.coffee" )
        .pipe( plumber( errorHandler ))
        .pipe( named() )
        .pipe( webpackStream( webpackConfig({ production: __PROD__ })))
        .pipe( gulp.dest( config.build ))
)

gulp.task( "images", () =>
    gulp.src( "./src/images/**/*" )
        .pipe( imagemin() )
        .pipe( gulp.dest( path.join( config.build, "images" )))
)

gulp.task( "bump", [ "bump:package.json", "bump:manifest.json"] )

gulp.task( "bump:package.json", () =>
    gulp.src( "package.json" )
        .pipe( bump() )
        .pipe( gulp.dest( "./" ))
)

gulp.task( "bump:manifest.json", () =>
    gulp.src( path.join( config.build, "manifest.json" ))
        .pipe( bump() )
        .pipe( gulp.dest( "./src/" ))
)

gulp.task( "zip", () =>
    gulp.src( path.join( config.build, "**/*.{json,css,js,html,jpg,jpeg,png,gif}" ))
        .pipe( zip( zipName() ))
        .pipe( gulp.dest( config.release ) )
)


gulp.task( "upload", () => {
    const filename = path.join( config.release, zipName() )
    const zipStream = fs.createReadStream( filename )

    return WebStore( config.webstoreAccount )
        .uploadExisting( zipStream )
        .then( response =>
            response && response[ "uploadState" ] === "SUCCESS"
                ? console.log( "Upload success" )
                : console.error( "Upload failed" )
        )
        .catch( response => {
            console.error( "Upload failed:" )
            console.log( response )
        })
})

gulp.task( "watch", () => {
    gulp.watch( "./src/{icons,templates,scripts}/**/*.{pug,svg}", [ "templates" ] )
    gulp.watch( "./src/scripts/**/*", [ "scripts" ] )
    gulp.watch( "./src/{icons,styles}/**/*", [ "styles" ] )
    gulp.watch( "./src/images/**/*", [ "images" ] )
})