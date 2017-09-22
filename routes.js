const handlers = require('./handlers.js');

function rootRoute(request, reply) {
	reply('Hapi World!');
}

let routes = [
	{
		method: 'GET',
		path: '/',
		handler: rootRoute
	}, {
		method: 'GET',
		path: '/logs',
		handler: handlers.logs.get
	},
	{
		method: 'POST',
		path: '/logs',
		handler: handlers.logs.save
	}
];

module.exports = routes;
