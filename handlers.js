var logService = require('./services/log-service.js');

module.exports = {
    logs: {
        get: function(request, reply) {
            let params = {};
            let logs = logService.get(params);
            reply(logs);
        },
        save: function(request, reply) {
            let requestBody = request.payload;
            let log = logService.save(requestBody);
            reply(log);
        }
    }
};