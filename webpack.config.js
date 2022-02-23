const path = require('path');

module.exports = {
    entry: 'C:\2044889-big-trip-1/src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devtool: 'source-map',
    devServer: {
        hot: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            }
        ]
    }
};