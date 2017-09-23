const Hapi = require('hapi');
const server = new Hapi.Server();
const db = require('./data-access').db;
const routes = require('./routes');
const secret = require('./config').secret;

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

server.connection({
	host: '0.0.0.0',
	port: port
});

server.register(require('hapi-auth-jwt'), (err) => {
	// We're giving the strategy both a name
	// and scheme of 'jwt'
	server.auth.strategy('jwt', 'jwt', {
		key: secret,
		verifyOptions: { algorithms: ['HS256'] }
	});
});

// localhost:4000
server.route(routes);
server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
