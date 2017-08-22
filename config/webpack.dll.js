var path = require("path");
var webpack = require("webpack");

const vendors = [
    'antd',
    'lodash',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-router-redux',
    'redux',
    'redux-saga',
    'history',
    'whatwg-fetch',
    'styled-components',
    'object-assign',
    'promise'
];

module.exports = {
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json','.jsx'],
    },
    entry: {
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, "../public"),
        filename: "[name].[chunkhash].js",
        library: "[name]_[chunkhash]"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.DllPlugin({
            context: __dirname,
            path: path.resolve(__dirname, "../public", "manifest_[name].json"),
            name: "[name]_[chunkhash]"
        }),
        // new webpack.ProvidePlugin({
        //     $: 'zepto'
        // }),
        new webpack.ProgressPlugin({ profile: false }),
        new webpack.optimize.UglifyJsPlugin(),
    ],
};
