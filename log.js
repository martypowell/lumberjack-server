var restify = require('restify');
var fs = require('fs');
var moment = require('moment');
var readline = require('readline');
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

module.exports = Log;