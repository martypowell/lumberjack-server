'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../models/user');
const createToken = require('./token-service').createToken;

function issueUserToken(email) {
	let user = new User();
	user.email = email;
	return { id_token: createToken(user) };
}

function createUser(email, password) {
	return new Promise((resolve, reject) => {
		let user = new User();
		user.email = email;
		user.admin = false;

		return hashPassword(password, (err, hash) => {
			if (err) {
				return reject(err);
			}
			user.password = hash;
			return user.save((saveErr, savedUser) => {
				if (saveErr) {
					return reject(saveErr);
				}
				// If the user is saved successfully, issue a JWT
				// res({ id_token: createToken(user) }).code(201);
				return resolve({ id_token: createToken(savedUser) });
			});
		});
	});
}

function hashPassword(password, cb) {
	// Generate a salt at level 10 strength
	bcrypt.genSalt(10, (saltErr, salt) => {
		bcrypt.hash(password, salt, (bcryptErr, hash) => {
			return cb(bcryptErr, hash);
		});
	});
}

function verifyUniqueUser(email) {
	// Find an entry from the database that
	// matches either the email or username
	User.findOne({ email: email },
		(err, user) => {
			// Check whether the email
			// is already taken and error out if so
			if (user && user.email === email) {
				return false;
			}
			// If everything checks out, send the payload through
			// to the route handler
			return true;
		}
	);
}

function verifyCredentials(email, password) {
	// Find an entry from the database that
	// matches either the email or username
	User.findOne({ email: email },
		(dbErr, user) => {
			if (!user) {
				return Boom.badRequest('Username or password is invalid');
			}
			bcrypt.compare(password, user.password, (bcryptErr, isValid) => {
				if (isValid) {
					return user;
				}
				return Boom.badRequest('Username or password is invalid');
			});
			return Boom.badRequest('Unknown issue has occured. Please contact support.');
		}
	);
}

let userService = {
	issueUserToken: issueUserToken,
	createUser: createUser,
	hashPassword: hashPassword,
	verifyCredentials: verifyCredentials,
	verifyUniqueUser: verifyUniqueUser
};

module.exports = userService;

