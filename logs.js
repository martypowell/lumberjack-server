var restify = require('restify');
var fs = require('fs');
var moment = require('moment');
var readline = require('readline');

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

module.exports = Logs;