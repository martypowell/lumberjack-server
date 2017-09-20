var restify = require('restify');
var corsMiddleware = require('restify-cors-middleware');

var server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.pre(cors.preflight)
server.use(cors.actual)

var cors = corsMiddleware({
    origins: [
        'http://localhost:8000',
        'http://localhost:8080',
        'http://192.168.0.44:8080',
        'http://192.168.0.44:8081',
        'http://172.28.1.116:8081'
    ]
});

module.exports = server;