const Hapi = require('hapi');
const server = new Hapi.Server();
const db = require('./data-access').db;
const routes = require('./routes');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

server.connection({
    host: '0.0.0.0',
    port: port
});

// localhost:4000
server.route(routes);
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});