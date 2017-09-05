let LogModel = require('./models/logs.js');

const logService = () => {
    const get = (logParameters) => {
        if (!logParameters) {
            logParameters = {};
        }
        return LogModel.find(logParameters, function (err, logs) {
            if (err) {
                return null;
            }
            return logs;
        });
    };

    const save = (log) => {
        log.save(function (err) {
            if (err) {
                return null;
            }
            return log;
        });
    };

    return {
        Get: get,
        Save: save
    }
};



module.exports = logService;