var restify = require('restify');
var fs = require('fs');
var moment = require('moment');
var corsMiddleware = require('restify-cors-middleware');
var winston = require('winston');
var readline = require('readline');

var browserService = require('./browser-service.js');

var logPath = './logs/'
var logName = 'lumberjack.log';
var apiVersion = "1.0.0";
var rootPath = '/api/' + apiVersion;

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
        new winston.transports.File({
            filename: getFullLogPath()
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: logPath + 'error.log'
        })
    ]
});

/**
 * 
 * @param {*} callback 
 */

function Log(logHandler) {
    var self = this;
    self.path = getFullLogPath();
    self.logHandler = logHandler;

    self.Create = function (log, callback) {
        self.data = {};
        self.data.appName = log.appName;
        self.data.dateCreated = new Date();
        self.data.type = log.type;
        self.data.message = log.message;
        self.data.otherData = JSON.parse(log.otherData);
        self.data.browserData = JSON.parse(log.browserData);
        var browserInfo = browserService.getBrowserInfoFromUserAgent(self.data.browserData.userAgent, true).split(' ');
        self.data.browserName = browserInfo[0];
        self.data.browserVersion = browserInfo[1];

        save(self.data, callback);
    }
    function save(log, callback) {
        self.logHandler.log('info', log.message, log, function () {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    };
}

/**
 * logs stuff
 */
function Logs() {
    this.Get = function (options, callback) {
        var date = options.date || null;
        var filePath = getFullLogPath(date);
        var dataArr = [];

        function onLine(line) {
            dataArr.push(JSON.parse(line));
        }

        function onClose() {
            return callback(dataArr);
        }

        readline.createInterface({
                input: fs.createReadStream(filePath),
                terminal: false
            })
            .on('line', onLine)
            .on('close', onClose);
    }
    this.Filter = function () {
        //TODO: implement
    }
}

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
        'http://192.168.0.44:8081'
    ]
});

server.pre(cors.preflight)
server.use(cors.actual)

/**
 * Routes
 */

server.get(rootPath + '/logs?date=:date&browsers=:browsers', function (req, res, next) {
    var date = req.query && req.query.hasOwnProperty('date') ? req.query.date : null;
    var browsers = req.query && req.query.hasOwnProperty('browsers') ? req.query.browsers : [];

    new Logs().Get({
        date: date,
        browsers: browsers
    }, function (log) {
        res.send(200, log);
        return next();
    });

})

server.post(rootPath + '/logs', function (req, res, next) {
    new Log(logger).Create(req.body, function () {
        res.send(201); //Record Created
        return next();
    });
}, function () {});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});