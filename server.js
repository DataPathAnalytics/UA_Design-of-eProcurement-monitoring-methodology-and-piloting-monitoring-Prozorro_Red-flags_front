var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var httpProxy = require('http-proxy');
var express = require('express')
var apiProxy = httpProxy.createProxyServer();
var app = new (express)()
var port = 3003;


const apiHost = 'http://localhost:8090/';
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));
app.use('/static', express.static('public'));


apiProxy.on('error', function (e) {
    console.log(e)
});

app.get('/api/*', function (req, res) {
    apiProxy.web(req, res, {target: apiHost});

});

app.post('/api/*', function (req, res) {
    apiProxy.web(req, res, {target: apiHost});
})

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})


app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.log(__dirname)
        console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
})
