const Mongoose = require('mongoose');
const config = require('./config.js');
const Logger = require('./logger');

// load database
Mongoose.connect(config.development.dbConnectionStr);
const db = Mongoose.connection;
db.on('error', function onError(err) {
	Logger.error(err);
});
db.once('open', function callback() {
	Logger.info('Connection with database succeeded.');
});
exports.db = db;
