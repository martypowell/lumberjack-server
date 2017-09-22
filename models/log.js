var mongoose = require('mongoose');
var logSchema = require('../schemas/db/log.js');

module.exports = mongoose.model('Log', logSchema);