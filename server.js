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

function writeFile(filePath, logs, next) {
    var data = logs || '[]';
    fs.writeFile(filePath, data, 'utf8', function () {
        console.log('writing file at: ' + filePath);
        if (next && typeof next === 'function') {
            return next();
        }
    });
}

function processLogs(logData, next) {
    var filePath = getFullLogPath();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            //Else file probably doesn't exist, create it
            writeFile(filePath);
            processLogs(logData); //TODO: THIS NEEDS TO BE FIXED
        }
        else {
            var logs = JSON.parse(data);
            logs.push(logData);

            console.log('logs', logs)
            console.log('logData', logData);

            writeFile(filePath, JSON.stringify(logs), next);
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

Log.prototype.Save = function Save(next) {
    processLogs(this, next);
}


function createLog(data, next) {
    var log = new Log();

    log.appName = data.appName;
    log.dateCreated = new Date();
    log.type = data.type;
    log.message = data.message;
    log.otherData = JSON.parse(data.otherData);
    log.browserData = JSON.parse(data.browserData);

    //console.log('mylog', log);

    log.Save(next);
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
  origins: ['http://localhost:8000', 'http://localhost:8080', 'http://172.28.1.116:8081']
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
    createLog(req.body, next);
}, function () {
});

server.listen(8080, function () {
    
    console.log('%s listening at %s', server.name, server.url);
});