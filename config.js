var dbConnectionStr = process.env.MONGODB_URI || "mongodb://localhost:27017/lumberjack-dev";
const configuration = {
    version: "1.0.0",
    development: {
        dbConnectionStr: dbConnectionStr
    },
    production: {
        dbConnectionStr: "mongodb://localhost:27017/lumberjack-dev"
    }
};

module.exports = configuration;