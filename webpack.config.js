const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         title: 'webpack Boilerplate',
    //         template: path.resolve(__dirname, './index.html'),
    //         filename: 'index.html', 
    //     }),
    // ],
    mode: 'development',
}