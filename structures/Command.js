const CommandHandler = require('./CommandHandler');

/**
 * Represents an abstract command
 * @abstract
 */
class Command {
	/**
	 * Instantiate a new command
	 * @param {CommandHandler} handler Instantiating command handler
	 * @param {Object} options Command options
	 */
	constructor(handler, {
		aliases = [],
		coins = 10,
		cooldown = 5000,
		enabled = true,
		description,
		examples = ['No example provided.'],
		exp = 850,
		name,
		usage,
		permLevel = 0
	} = {}) {
		if (!(handler instanceof CommandHandler)) {
			throw new Error(`Command ${this.constructor.name}'s client is not instanceof Client!`);
		}
		if (!(aliases instanceof Array)) {
			throw new Error(`Command ${this.constructor.name}'s aliases is not instanceof array!`);
		}
		if (!description) {
			throw new Error(`Command ${this.constructor.name} does not have a description!`);
		}
		if (!(examples instanceof Array)) {
			throw new Error(`Command ${this.constructor.name}'s examples is not instanceof array!`);
		}
		if (!name) {
			throw new Error(`Command ${this.constructor.name} does not have a name!`);
		}

		/**
		 * Client that instantiated this command
		 * @type {Client}
		 */
		this.client = handler.client;

		/**
		 * Command handler this Command is part of
		 * @type {CommandHandler}
		 */
		this.handler = handler;
		/**
		 * The category of this command
		 * @type {string}
		 */
		this.category = null;
		/**
		 * The location of command
		 * @type {string}
		 */
		this.location = null;

		/**
		 * Aliases of this command
		 * @type {string[]}
		 */
		this.aliases = aliases;
		/**
		 * Amount of coins a user receives for using this command
		 * @type {number}
		 */
		this.coins = coins;
		/**
		 * Time in milliseconds a user has to wait before using this command again
		 * @type {number}
		 */
		this.cooldown = cooldown;
		/**
		 * Whether this command is enabled
		 * @type {boolean}
		 */
		this.enabled = enabled;
		/**
		 * Description of this command
		 * @type {string}
		 */
		this.description = description;
		/**
		 * Examples of this command
		 * @type {string[]}
		 */
		this.examples = examples;
		/**
		 * Amount of experience awarded to the user when using this command
		 * @type {number}
		 */
		this.exp = exp;
		/**
		 * Name of the command
		 * @type {string}
		 */
		this.name = name;
		/**
		 * How this command is to be used
		 * @type {string}
		 */
		this.usage = usage;
		/**
		 * The required perm level to use this command
		 * The available types are:
		 * - 4 (Devs)
		 * - 3 (Support on official guild)
		 * - 2 (People with ban and kick members)
		 * - 1 (Dragon Tamer)
		 * - 0 (Everyone else)
		 * @type {number}
		 */
		this.permLevel = permLevel;
	}

	/**
	 * Reloads this command
	 */
	reload() {
		delete require.cache[require.resolve(this.location)];
		this.handler.commands.delete(this.name);
		for (const alias of this.aliases) {
			this.handler.aliases.delete(alias);
		}

		const CommandClass = require(this.location);
		const command = new CommandClass(this.handler);

		command.location = this.location;
		command.category = this.category;

		this.handler.commands.set(command.name, command);
		for (const alias of command.aliases) {
			this.handler.aliases.set(alias, command.name);
		}

		this.handler.logger.load(`[COMMANDS] Reloaded command ${command.name}.`);
	}

	/**
	 * Runs this command
	 * @param {Message} message Message triggering this method
	 * @param {string[]} args Passed args
	 * @abstract
	 */
	run(message, args) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} does not implement a run method!`);
	}
}

module.exports = Command;
