/**
 * npm modules
 */
var mongoose = require('mongoose');
var server = require('./server');







/**
 * Routes
 */

mongoose.connect(config.dbConnectionStr, {
    useMongoClient: true
}, function (err, db) {
    if (err) {
        throw err;
    }


}, function () { });

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
