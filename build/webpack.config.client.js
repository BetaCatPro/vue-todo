const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV == 'development'

const defaultPlugins = [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),
    new HTMLPlugin({
        title: "mytodo", //网页标题
        filename: "index.html",
        favicon: ''
    }),
    new VueClientPlugin()
]

const devServer = {
    port: 8000,
    host: 'localhost',
    overlay: {
        // webpack编译出现错误，则显示到网页上
        error: true,
    },
    hot: true, //不刷新热加载数据
    //open: true //直接打开浏览器
}

let extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {}
};

//判断不同环境
if (isDev) {
    config = merge(baseConfig, {
        devtool: '#cheap-module-eval-source-map',
        module: {
            rules: [{
                test: /\.styl/,
                use: [
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
        devServer,
        plugins: defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ])
    })
} else {
    // 生产坏境的配置

    config = merge(baseConfig, {
        entry: {
            //entry: path.join(__dirname, '../client/client-entry.js')
            app: path.join(__dirname, '../client/index.js'),
            vender: ['vue']
        },
        output: {
            filename: '[name].[chunkhash:8].js',
            // publicPath: '/public/'
        },
        module: {
            rules: [{
                test: /\.styl/,
                use: [
                    extractLoader,
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
        plugins: defaultPlugins.concat([
            new MiniCssExtractPlugin({
                filename: "[name].[chunkhash:8].css"
            })
        ])
    })
}

//将类库文件单独打包出来
config.optimization = {
    splitChunks: {
        chunks: 'async', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
        // 大于30KB才单独分离成chunk
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3, // 最大初始化请求书，默认1
        name: true,
        cacheGroups: { //设置缓存的 chunks
            default: {
                priority: -20,
                reuseExistingChunk: true,
            },
            vendors: {
                name: 'vender', // 要缓存的 分隔出来的 chunk 名称
                test: /[\\/]node_modules[\\/]/, //正则规则验证 符合就提取 chunk
                priority: -10, // 缓存组优先级
                chunks: "all" // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            },
            echarts: {
                name: 'echarts',
                chunks: 'all',
                priority: 20,
                test: function(module) {
                    var context = module.context;
                    return context && (context.indexOf('echartd') >= 0 || context.indexOf('zrender') >= 0)
                }
            }
        }
    },
    //单独打包 runtimeChunk
    runtimeChunk: {
        name: "manifest"
    },
    // 压缩代码
    minimizer: [
        // js mini
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false // set to true if you want JS source maps
        }),
        // css mini
        new OptimizeCSSPlugin({})
    ]
}

module.exports = config