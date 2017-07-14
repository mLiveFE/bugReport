const webpack = require('webpack')
module.exports = {
    target: 'node',
    entry: {
        'index': './src/index.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: ['eslint-loader'],
            exclude: /node_modules/
        }]
    },
    node: {
        require: false
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'bugReport'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            sourceMap: false
        })
    ]
}