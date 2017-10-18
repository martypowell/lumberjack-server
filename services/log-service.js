/**
 * This is a test comment
 */
let LogModel = require('../models/log');
const Logger = require('../logger');

const get = (logParameters) => {
	if (!logParameters) {
		logParameters = {};
	}

	return LogModel.find(logParameters, function findLogs(err, logs) {
		if (err) {
			return HandlerError(err);
		}
		Logger.info('Getting Logs...' + logs);
		return logs;
	});
};

const save = (logToSave) => {
	var log = new LogModel(logToSave);
	return log.save(function saveLog(err) {
		if (err) {
			return HandlerError(err);
		}
		return log.toObject();
	});
};

function HandlerError(err) {
	Logger.error(err);
	return null;
}

module.exports = {
	get: get,
	save: save
};
