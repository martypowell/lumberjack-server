const Hapi = require('hapi');
const server = new Hapi.Server();
const routes = require('./routes');
const secret = require('./config').secret;
const db = require('./data-access');
const handlebars = require('handlebars');
const vision = require('vision');
const hapiAuthJwt = require('hapi-auth-jwt');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

server.connection({
	host: '0.0.0.0',
	port: port
});

server.register([hapiAuthJwt, vision], (err) => {
	if (err) {
		throw err;
	}
	// We're giving the strategy both a name
	// and scheme of 'jwt'
	server.auth.strategy('jwt', 'jwt', {
		key: secret,
		verifyOptions: { algorithms: ['HS256'] }
	});

	server.route(routes);

	server.views({
		engines: {
			html: handlebars
		},
		relativeTo: __dirname,
		path: './public/templates',
		layoutPath: './public/templates/layout',
		helpersPath: './public/templates/helpers'
	});
});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
