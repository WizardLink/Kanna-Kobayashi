const Command = require('../../structures/Command');

class BlacklistCommand extends Command {
	constructor(handler) {
		super(handler, {
			coins: 0,
			cooldown: 0,
			description: 'Blacklists a user, disallowing them and their guilds to use the bot.',
			examples: ['blacklist @space#0302'],
			exp: 0,
			name: 'blacklist',
			usage: 'blacklist <User> [\'remove\']',
			permLevel: 4
		});
	}

	async run(message, [target, remove]) {
		// To allow nicknames, I am so sure they will be used.
		let user = await this.handler.resolveMember(message.guild, target, false);
		if (!user) user = await this.client.fetchUser(target).catch(() => null);
		if (!user || user.bot) return message.channel.send(`Could not find a non-bot user by ${target}!`);

		const targetModel = user.model || await user.fetchModel();
		if (['DEV', 'TRUSTED'].includes(targetModel.type)) {
			return message.channel.send(`Devs or trusted users can not be blacklisted. Maybe entered the wrong user?`);
		}

		if (targetModel.type === 'BLACKLISTED') {
			if (remove === 'remove') {
				targetModel.type = null;
				await targetModel.save();

				return message.channel.send(`**${user.tag}** has been removed from the blacklist.`);
			}

			return message.channel.send(`**${user.tag}** is already blacklisted.`);
		}

		targetModel.type = 'BLACKLISTED';
		await targetModel.save();

		return message.channel.send(`**${user.tag}** has been added to the blacklist.`);
	}
}

module.exports = BlacklistCommand;