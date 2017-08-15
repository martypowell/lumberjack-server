var restify = require('restify');
var fs = require('fs');
var jsonfile = require('jsonfile');
var moment = require('moment');
var corsMiddleware = require('restify-cors-middleware');
var winston = require('winston');
var readline = require('readline');

var logPath = './logs/'
var logName = 'lumberjack.log';

/**
 * Winston Configruation
 */
var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({ filename: getFullLogPath() })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: logPath + 'error.log' })
    ]
});

function getFileName() {
    var dateStr = moment().format('YYYYMMDD');
    var logNameParts = logName.split('.');
    return logNameParts[0] + '-' + dateStr + '.' + logNameParts[1];
}

function getFullLogPath() {
    var fileName = getFileName();
    return logPath + fileName;
}

function processLogs(logData, callback) {
    var filePath = getFullLogPath();
    logger.log('info', logData.message, logData, function() {
        callback();
    });
}

//TODO: Add paging
function getLogs(callback) {
    var filePath = getFullLogPath();
    var dataArr = [];
    readline.createInterface({
        input: fs.createReadStream(filePath),
        terminal: false
    }).on('line', function (line) {
       dataArr.push(JSON.parse(line)); 
    }).on('close', function() {
        return callback(dataArr);
    });
}

function Log() {

}

Log.prototype.Save = function Save(callback) {
    processLogs(this, callback);
}


function createLog(data, callback) {
    var log = new Log();

    log.appName = data.appName;
    log.dateCreated = new Date();
    log.type = data.type;
    log.message = data.message;
    log.otherData = JSON.parse(data.otherData);
    log.browserData = JSON.parse(data.browserData);

    log.Save(callback);
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var cors = corsMiddleware({
    origins: [
        'http://localhost:8000',
        'http://localhost:8080',
        'http://172.28.1.116:8081',
        'http://192.168.0.44:8081',
        'http://172.28.1.116:8081'
    ]
});

server.pre(cors.preflight)
server.use(cors.actual)

server.get('/logs', function (req, res, next) {
    getLogs(function (log) {
        res.send(200, log);
        return next();
    });

})
server.post('/logs', function (req, res, next) {
    createLog(req.body, function () {
        res.send(201); //Record Created
        return next();
    });
}, function () { });

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});