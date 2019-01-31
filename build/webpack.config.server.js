const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

let config

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
    new MiniCssExtractPlugin({
        filename: "styles.[contentHash:8].css"
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"server"'
    })
]

let extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {}
};

if (isDev) {
    plugins.push(new VueServerPlugin())
}

config = merge(baseConfig, {
    target: 'node',
    entry: path.join(__dirname, '../client/server-entry.js'),
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2',
        filename: 'server-entry.js',
        path: path.join(__dirname, '../server-build')
    },
    externals: Object.keys(require('../package.json').dependencies),
    module: {
        rules: [{
            test: /\.styl/,
            use: [
                extractLoader,
                'style-loader',
                'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                'stylus-loader'
            ]
        }]
    },
    plugins,
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
})

// config.resolve = {
//     alias: {
//         'model': path.join(__dirname, '../client/model/server-model.js')
//     }
// }

module.exports = config