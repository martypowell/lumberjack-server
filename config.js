var dbConnectionStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumberjack-dev';

const configuration = {
	secret: 'ao2_3OriogcpDXWiAz0byL6UZR5l-4zrkMGk4SovIyNuSlpmIlTcfDUndiguGra4',
	version: '1.0.0',
	development: {
		dbConnectionStr: dbConnectionStr
	},
	production: {
		dbConnectionStr: 'mongodb://localhost:27017/lumberjack-dev'
	}
};

module.exports = configuration;
