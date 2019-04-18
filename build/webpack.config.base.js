const path = require('path')
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    // entry: path.join(__dirname, '../client/client-entry.js'),
    entry: path.join(__dirname, '../client/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        // server:client
        path: path.join(__dirname, '../dist'),
        // publicPath: 'http://127.0.0.1/8000/public/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: createVueLoaderOptions(isDev)
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            /*{
                test: /\.styl$/,
                use: ['style-loader','css-loader',{loader:'postcss-loader',options:{sourceMap:true}},'stylus-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },*/
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }, {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024, // 文件小于1024字节，转换成base64编码，写入文件里面
                        name: 'resources/[path][name].[hash:8].[ext]'
                    }
                }]
            }
        ]
    }
}

module.exports = config