/**
 * This is a test comment
 */
let LogModel = require('../models/log.js');

const get = (logParameters) => {
	if (!logParameters) {
		logParameters = {};
	}
	return LogModel.find(logParameters, function (err, logs) {
		if (err) {
			return null;
		}
		return logs;
	});
};

const save = (logToSave) => {
	var log = new LogModel(logToSave);
	return log.save(function (err) {
		if (err) {
			return null;
		}
		return log.toObject();
	});
};

module.exports = {
	get: get,
	save: save
};
