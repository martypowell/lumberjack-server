var mongoose = require('mongoose');

var logSchema = mongoose.Schema({
	appName: String,
	type: String,
	message: String,
	dateCreated: Date
});

logSchema.pre('save', function save(next) {
	this.dateCreated = new Date();
	next();
});

module.exports = logSchema;
