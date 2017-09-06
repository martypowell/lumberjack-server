const server = require('./server.js'); //TODO: Need to actually export stuff for this
const constants = require('./server/api/constants.js');
const logService = require('./service/log-service.js');
const Log = require('./models/logs.js');

const logsApi = (server, constants, logService, Log => {
    const get = (request, response, next) => {
        const queryParameters = getLogQueryParameters(request);

        logService.Get(queryParameters)
            .then(handleResponse)
            .then(() => completeResponse(next));
    };

    const save = (request, response, next) => {
        const logFromBody = getLogFromRequestBody(request);

        logService.Save(logFromBody)
            .then(handleResponse)
            .then(() => completeResponse(next));

    };

    const getLogQueryParameters = (request) => {
        //TODO: Fully implement this
        if (!request && !req.query) {
            return null;
        }

        const date = req.query.hasOwnProperty('date') ? req.query.date : null;
        const browsers = req.query.hasOwnProperty('browsers') ? req.query.browsers : [];

        return {
            date: date,
            browsers: browsers
        };
    };

    const getLogFromRequestBody = (request) => {
        if (!req || !req.body) {
            return null;
        }
        return new Log(req.body);
    };

    const handleResponse = (err, dataResponse, responseToSend) => {
        return new Promise((resolve, reject) => {
            try {
                if (err) {
                    responseToSend.send(500, err);
                }
                else {
                    responseToSend.send(200, dataResponse);
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    };

    const completeResponse = (next) => {
        return next();
    }

    return {
        Get: get,
        Save: save
    }
})();

server.get(constants.urls.get, logsApi.Get);
server.get(constants.urls.save, logsApi.Save);

module.exports = server;