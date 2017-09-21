const configuration = {
    version: "1.0.0",
    development: {
        dbConnectionStr: "mongodb://heroku_4pws3sg1:oqbj44003a8ne2sf537q8csptd@ds147274.mlab.com:47274/heroku_4pws3sg1"
    },
    production: {
        dbConnectionStr: "mongodb://localhost:27017/lumberjack-dev"
    }
};

module.exports = configuration;