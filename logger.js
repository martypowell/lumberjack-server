var winston = require('winston');
require('winston-mongodb').MongoDB;
var mongoConnectionString = 'mongodb://localhost:27017/lumberjack-dev';
var logPath = './logs/'
var logName = 'lumberjack.log';

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
            filename: logPath + logName
        })
    ]
});

module.exports = logger;