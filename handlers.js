const logService = require('./services/log-service');
const userService = require('./services/user-service');
const tokenService = require('./services/token-service');
const Boom = require('boom');
const Logger = require('./logger');

function getLogs(request, reply) {
	Logger.info('Getting Logs Handler');
	let params = {};
	const logs = logService.get(params);
	reply(logs);
}
function saveLogs(request, reply) {
	const requestBody = request.payload;
	const log = logService.save(requestBody);
	reply(log);
}

function createUser(request, reply) {
	try {
		if (request.pre.isUserAvailable === false) {
			const resStr = 'Email address has already been registered, please contact support if you own this email address.';
			reply(Boom.badRequest(resStr));
			return;
		}

		const email = request.payload.email;
		const password = request.payload.password;

		userService.createUser(email, password)
			.then(reply)
			.catch((err) => {
				reply(Boom.badRequest(err));
			});
	} catch (err) {
		Logger.error(err);
	}
}

function getUsers(request, reply) {
	userService.getUsers()
		.then(reply)
		.catch((err) => {
			reply(Boom.badRequest(err));
		});
}

function issueUserToken(request, reply) {
	const user = request.pre.user;
	const userToken = tokenService.issueToken(user);
	reply(userToken);
}

function verifyUniqueUser(request, reply) {
	const email = request.payload.email;
	userService.verifyUniqueUser(email)
		.then((isAvailable) => {
			reply(isAvailable);
		})
		.catch((err) => {
			reply(Boom.badRequest(err));
		});
}

function verifyCredentials(request, reply) {
	const email = request.payload.email;
	const password = request.payload.password;
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
	get: getUsers,
	issueUserToken: issueUserToken,
	verifyCredentials: verifyCredentials,
	verifyUniqueUser: verifyUniqueUser
};

module.exports = {
	logs: logs,
	users: users
};
