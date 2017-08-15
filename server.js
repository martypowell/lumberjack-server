var restify = require('restify');
var fs = require('fs');
var moment = require('moment');
var corsMiddleware = require('restify-cors-middleware');

var logPath = './logs/'
var logName = 'lumberjack.json';

function getFileName() {
    var dateStr = moment().format('YYYYMMDD');
    var logNameParts = logName.split('.');
    return logNameParts[0] + '-' + dateStr + '.' + logNameParts[1];
}

function getFullLogPath() {
    var fileName = getFileName();
    return logPath + fileName;
}

function createFile(filePath, callback) {
    fs.writeFile(filePath, '', 'utf8', function () {
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

function writeFile(filePath, logs, callback) {
    var data = logs || '[]';
    fs.writeFile(filePath, data, 'utf8', function () {
        if (callback && typeof callback === 'function') {
            return callback();
        }
    });
}

function processLogs(logData, callback) {
    var filePath = getFullLogPath();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            createFile(filePath, function() {
                processLogs(logData, callback);
            });
        } else {
            var logs = data ? JSON.parse(data) : [];

            logs.push(logData);

            writeFile(filePath, JSON.stringify(logs), callback);
        }
    });
}

//TODO: Add paging
function getLogs(callback) {
    var filePath = getFullLogPath(callback);
    return fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            //TODO: Handle Error
            return callback([]);
        }
        return callback(JSON.parse(data));
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

// console.log('tset', restify.plugins.CORS);

// server.opts(/.*/, function (req,res,next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
//     res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
//     res.send(200);
//     return next();
// });

var cors = corsMiddleware({
    origins: [
        'http://localhost:8000',
        'http://localhost:8080',
        'http://172.28.1.116:8081',
        'http://192.168.0.44:8081'
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
    createLog(req.body, function() {
        res.send(201); //Record Created
        return next();
    });
}, function () {});

server.listen(8080, function () {

    console.log('%s listening at %s', server.name, server.url);
});