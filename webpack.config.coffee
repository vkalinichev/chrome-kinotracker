config = require 'config'
path = require 'path'
webpackStream = require 'webpack-stream'
webpack = webpackStream.webpack

module.exports = ( { production } ) ->

    context: path.join __dirname, "/src/scripts"

    output:
        filename: "[name].js"

    module:
        loaders: [
            test: /\.coffee$/
            loader: "coffee"
        ,
            test: /\.pug$/
            loader: "pug"
        ]

    resolve:
        extensions: [
            ""
            ".coffee"
            ".pug"
            ".js"
        ]

    plugins: if production
        [ new webpack.optimize.UglifyJsPlugin() ]
    else
        []

    devtool: if production then null else "source-map"