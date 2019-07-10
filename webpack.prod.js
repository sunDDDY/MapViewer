const path = require('path');
const fs = require('fs');
const version = fs.readFileSync('.version', 'utf-8');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: './javascripts/bundle.[hash].js',
    },
    devServer: {
        overlay: true,
        port: 3000,
        open: true,
        inline: true,

        historyApiFallback: true,
        noInfo: true
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "vue-style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif|woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']), // cleaned previous build
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: `Map Viewer v${version}`,
            template: 'index.html',
            favicon: 'src/images/favicon.png'
        }),
        new ExtractTextPlugin({
            filename: './css/style.[hash].css',
            allChunks: true,
            disable: false
        }),
    ],
};
