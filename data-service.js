var config = require('./config.js').development;
var mongoose = require('mongoose');

mongoose.connect(config.dbConnectionStr);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    var logSchema = mongoose.Schema({
        browserName: String,
        type: String,
        message: String,
        dateCreated: Date
    });

    var log = mongoose.Model('Log', logSchema);



});

//module.exports = dataService;