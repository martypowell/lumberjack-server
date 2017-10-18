const handlers = require('./handlers.js');
const createUserSchema = require('./schemas/validation/createUser');
const authenticateUserSchema = require('./schemas/validation/authenticateUser');
const Logger = require('./logger');

const apiRoot = "/api";

function rootRoute(request, reply) {
	Logger.info('Logger is working: ' + request);
	reply('Hapi World!');
}

let routes = [
	{
		method: 'GET',
		path: '/',
		handler: function getIndex(request, reply) {
			reply.view('index');
		}
	},
	{
		method: 'GET',
		path: apiRoot + '/',
		handler: rootRoute
	},
	{
		method: 'GET',
		path: apiRoot + '/logs',
		handler: handlers.logs.get
	},
	{
		method: 'POST',
		path: apiRoot + '/logs',
		handler: handlers.logs.save
	},
	{
		method: 'GET',
		path: apiRoot + '/users',
		config: {
			handler: handlers.users.get,
			auth: {
				strategy: 'jwt',
				scope: ['admin']
			}
		}
	},
	{
		method: 'POST',
		path: apiRoot + '/users',
		config: {
			pre: [
				{
					method: handlers.users.verifyUniqueUser,
					assign: 'isUserAvailable'
				}
			],
			handler: handlers.users.create,
			validate: {
				payload: createUserSchema
			}
		}
	},
	{
		method: 'POST',
		path: apiRoot + '/users/authenticate',
		config: {
			pre: [
				{
					method: handlers.users.verifyCredentials,
					assign: 'user'
				}
			],
			// this handler will only be used if the pre condtions pass (aka credentials are verified)
			handler: handlers.users.issueUserToken,
			validate: {
				payload: authenticateUserSchema
			}
		}
	}
];

module.exports = routes;
