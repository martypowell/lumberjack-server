'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/user');
const createToken = require('./token-service').createToken;

function issueUserToken(email) {
	return { id_token: createToken(email) };
}

function createUser(email, password) {
	let user = new User();
	user.email = email;
	user.admin = false;

	hashPassword(password, (err, hash) => {
		if (err) {
			throw Boom.badRequest(err);
		}
		user.password = hash;
		user.save((saveErr, savedUser) => {
			if (err) {
				throw Boom.badRequest(saveErr);
			}
			// If the user is saved successfully, issue a JWT
			// res({ id_token: createToken(user) }).code(201);
			return { id_token: createToken(savedUser) };
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

