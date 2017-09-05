let Log = require('./models/logs.js');

const logService = () => {
    const get = (logParameters) => {
        return Log.find(logParameters, function (err, logs) {
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