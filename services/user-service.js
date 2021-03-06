'use strict';

const bcrypt = require('bcrypt');
const User = require('../models/user');
const tokenService = require('./token-service');

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
				resolve(tokenService.issueToken(user));
			});
		});
	});
}

function getUsers() {
	return new Promise((resolve, reject) => {
		return User.find({}, (err, users) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(users);
		});
	});
}

function hashPassword(password, cb) {
	// Generate a salt at level 10 strength
	return bcrypt.genSalt(10, (saltErr, salt) => {
		return bcrypt.hash(password, salt, (bcryptErr, hash) => {
			return cb(bcryptErr, hash);
		});
	});
}

function verifyUniqueUser(email) {
	return new Promise((resolve, reject) => {
		// Find an entry from the database that
		// matches either the email or username
		return User.findOne({ email: email }, (err, user) => {
			if (err) {
				return reject(err);
			}
			// Check whether the email
			// is already taken and error out if so
			if (user && user.email === email) {
				return resolve(false);
			}
			// If everything checks out, send the payload through
			// to the route handler
			return resolve(true);
		});
	});
}

function verifyCredentials(email, password) {
	return new Promise((resolve, reject) => {
		// Find an entry from the database that
		// matches either the email or username
		return User.findOne({ email: email }, (dbErr, user) => {
			if (dbErr) {
				reject(dbErr);
				return;
			}

			if (!user) {
				resolve('Username or password is invalid');
				return;
			}
			bcrypt.compare(password, user.password, (bcryptErr, isValid) => {
				if (bcryptErr) {
					reject(bcryptErr);
					return;
				}
				if (isValid) {
					resolve(user);
					return;
				}
				resolve('Username or password is invalid');
			});
		});
	});
}

let userService = {
	createUser: createUser,
	getUsers: getUsers,
	hashPassword: hashPassword,
	verifyCredentials: verifyCredentials,
	verifyUniqueUser: verifyUniqueUser
};

module.exports = userService;
