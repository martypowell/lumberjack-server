var mongoose = require('mongoose');
var logSchema = require('../schemas/log.js');

module.exports = mongoose.model('Log', logSchema);