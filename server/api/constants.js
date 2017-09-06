const config = require('./config.js');

let logConstants = {
    urls: {
        root: `api/${config.version}/`
    }
};

logConstants.urls.get =  logConstants.urls.root + 'logs?date=:date&browsers=:browsers';
logConstants.urls.save =  logConstants.urls.root + 'logs';

module.exports = logConstants;