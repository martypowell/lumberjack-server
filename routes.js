const handlers = require('./handlers.js');
module.exports = [{
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hapi World!');
    }
}, {
    method: 'GET',
    path: '/logs',
    handler: handlers.logs.get
},
{
    method: 'POST',
    path: '/logs',
    handler: handlers.logs.save
}];