var logService = require('./services/log-service.js');

function getLogs(request, reply) {
	let params = {};
	let logs = logService.get(params);
	reply(logs);
}
function saveLogs(request, reply) {
	let requestBody = request.payload;
	let log = logService.save(requestBody);
	reply(log);
}

var logs = {
	get: getLogs,
	save: saveLogs
};

module.exports = {
	logs: logs
};
