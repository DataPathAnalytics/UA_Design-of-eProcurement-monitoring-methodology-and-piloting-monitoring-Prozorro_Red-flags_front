var path = require('path')
var webpack = require('webpack')

module.exports = {
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js', '.jsx', '.css']
    },
    devtool: 'cheap-module-eval-source-map',
    entry: [
        // 'webpack-hot-middleware/client',
        'babel-polyfill',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "_": "lodash",
            "React": "react",
            "ReactDOM": "react-dom",
            "Highcharts": "highcharts",
            "uuid": "uuid-js"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],

    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, "src"),
                ],
            }
        ],
        loaders: [
            {
                loaders: ['babel-loader'],
                include: [
                    path.resolve(__dirname, "src"),
                ],
                test: /\.jsx?$/,
                plugins: ['transform-runtime',
                    new webpack.ProvidePlugin({
                        "_": "lodash",
                        "React": "react",
                        "ReactDOM": "react-dom",
                        "Highcharts": "highcharts",
                        "uuid": "uuid-js"
                    })],
            },
            {
                test: /\.css$/,
                loaders: ["style", "css", "sass"]
            },
        ]
    }
};
