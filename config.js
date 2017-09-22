var dbConnectionStr = process.env.MONGODB_URI || "mongodb://localhost:27017/lumberjack-dev";
const configuration = {
    secret: "pH+cu_a!R7cakuhajeHezufr3cU",
    version: "1.0.0",
    development: {
        dbConnectionStr: dbConnectionStr
    },
    production: {
        dbConnectionStr: "mongodb://localhost:27017/lumberjack-dev"
    }
};

module.exports = configuration;