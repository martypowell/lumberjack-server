const configuration = {
    version: "1.0.0",
    development: {
        dbConnectionStr: "mongodb://localhost:27017/lumberjack-dev"
    },
    production: {
        dbConnectionStr: "mongodb://localhost:27017/lumberjack-dev"
    }
};

module.exports = configuration;