var logService = require('./services/log-service');
var userService = require('./services/user-service');
const Boom = require('boom');

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

function createUser(request, reply) {
	if (request.pre.isUserAvailable === false) {
		var resStr = 'Email address has already been registered, please contact support if you own this email address.';
		reply(Boom.badRequest(resStr));
		return;
	}

	let email = request.payload.email;
	let password = request.payload.password;

	userService.createUser(email, password)
		.then(reply)
		.catch((err) => {
			reply(Boom.badRequest(err));
		});
}

function issueUserToken(request, reply) {
	let email = request.payload.email;
	let userToken = userService.issueUserToken(email);
	reply(userToken);
}

function verifyUniqueUser(request, reply) {
	let email = request.payload.email;
	userService.verifyUniqueUser(email)
		.then((isAvailable) => {
			reply(isAvailable);
		})
		.catch((err) => {
			reply(Boom.badRequest(err));
		});
}

function verifyCredentials(request, reply) {
	let email = request.payload.email;
	let password = request.payload.password;
	userService.verifyCredentials(email, password)
		.then(reply)
		.catch((err) => {
			reply(Boom.badRequest(err));
		});
}

var logs = {
	get: getLogs,
	save: saveLogs
};

var users = {
	create: createUser,
	issueUserToken: issueUserToken,
	verifyCredentials: verifyCredentials,
	verifyUniqueUser: verifyUniqueUser
};

module.exports = {
	logs: logs,
	users: users
};
