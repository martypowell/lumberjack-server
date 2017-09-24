const handlers = require('./handlers.js');
const createUserSchema = require('./schemas/validation/createUser');
const authenticateUserSchema = require('./schemas/validation/authenticateUser');

function rootRoute(request, reply) {
	reply('Hapi World!');
}

let routes = [
	{
		method: 'GET',
		path: '/',
		handler: rootRoute
	},
	{
		method: 'GET',
		path: '/logs',
		handler: handlers.logs.get
	},
	{
		method: 'POST',
		path: '/logs',
		handler: handlers.logs.save
	},
	{
		method: 'GET',
		path: '/users',
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
		path: '/users',
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
		path: '/users/authenticate',
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
