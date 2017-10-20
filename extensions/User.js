const { User } = require('discord.js');

const UserModel = require('../models/User');
const { Extension } = require('./Extension');

class UserExtension extends Extension {
	/**
	 * Retrieves the appropriate model instance of this user from cache or from database if not cached.
	 * @returns {Promise<User>} Model instance
	 */
	fetchModel() {
		return UserModel.fetchOrCache(this.id);
	}
}

module.exports = {
	Extension: UserExtension,
	Target: User
};
