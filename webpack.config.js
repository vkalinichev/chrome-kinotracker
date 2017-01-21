const config = require( 'config' )
const path = require( 'path' )
const webpackStream = require( 'webpack-stream' )
const webpack = webpackStream.webpack

console.log( path.join( __dirname, "/src/scripts" ) )

module.exports = ( { production } ) => ({

    context: path.join( __dirname, "/src/scripts" ),

    output: {
        filename: "[name].js"
    },

    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee" },
            { test: /\.pug$/, loader: "pug" }
        ]
    },

    resolve: {
        extensions: [ "", ".coffee", ".pug", ".js" ]
    },

    plugins: production ? [ new webpack.optimize.UglifyJsPlugin() ] : [],

    devtool: production ? null : "source-map"

})