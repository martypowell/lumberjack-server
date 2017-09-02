var restify = require('restify');
var fs = require('fs');
var moment = require('moment');
var corsMiddleware = require('restify-cors-middleware');

var winston = require('winston');
require('winston-mongodb').MongoDB;

var readline = require('readline');

var browserService = require('./browser-service.js');

var logPath = './logs/'
var logName = 'lumberjack.log';
var apiVersion = "1.0.0";
var rootPath = '/api/' + apiVersion;
var mongoConnectionString = 'mongodb://localhost:27017/lumberjack-dev';

var config = require('./config.js').development;
var mongoose = require('mongoose');
var Log = require('./models/log.js');



/**
 * Winston Configuration
 */
function getFileName(date) {
    var dateStr = date || moment().format('YYYYMMDD');
    var logNameParts = logName.split('.');
    return logNameParts[0] + '-' + dateStr + '.' + logNameParts[1];
}

function getFullLogPath(date) {
    var fileName = getFileName(date);
    return logPath + fileName;
}

var logger = new(winston.Logger)({
    transports: [
        // new winston.transports.File({
        //     filename: getFullLogPath()
        // }),
        new winston.transports.MongoDB({
            db: mongoConnectionString
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: logPath + 'error.log'
        })
    ]
});

/**
 * Server Code
 */

var server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

var cors = corsMiddleware({
    origins: [
        'http://localhost:8000',
        'http://localhost:8080',
        'http://192.168.0.44:8080',
        'http://192.168.0.44:8081',
        'http://172.28.1.116:8081'
    ]
});

server.pre(cors.preflight)
server.use(cors.actual)

/**
 * Routes
 */

mongoose.connect(config.dbConnectionStr, {
    useMongoClient: true
}, function (err, db) {
    if (err) {
        throw err;
    }


    server.get(rootPath + '/logs?date=:date&browsers=:browsers', function (req, res, next) {
        var date = req.query && req.query.hasOwnProperty('date') ? req.query.date : null;
        var browsers = req.query && req.query.hasOwnProperty('browsers') ? req.query.browsers : [];

        // get all the Logs
        Log.find({}, function (err, logs) {
            if (err) {
                throw err;
                res.send(500);
                return next();
            }

            res.send(200, logs);
            return next();
        });

    })

    server.post(rootPath + '/logs', function (req, res, next) {
        //TODO: Fix this so it returns the proper http code
        if (!req || !req.body) {
            res.send(500);
            return next();
        }

        var log = new Log(req.body);

        log.save(function (err) {
            if (err) {
                throw err;
                res.send(500, err);
                return next();
            }

            console.log('Log Created!');
            res.send(200, log);
            return next();
        });

    }, function () {});

});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});