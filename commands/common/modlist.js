const Command = require('../../structures/Command');
const RichEmbed = require('../../structures/RichEmbed');
const { titleCase, mapIterator }  = require('../../util/util');

class ModListCommand extends Command {
	constructor(handler) {
		super(handler, {
			aliases: ['mods'],
			clientPermissions: ['EMBED_LINKS'],
			coins: 0,
			cooldown: 5000,
			enabled: true,
			description: 'See the mod list of the guild!',
			examples: ['modlist online', 'modlist dnd'],
			exp: 0,
			name: 'modlist',
			usage: 'modlist [status]',
			permLevel: 0
		});
	}

	async run(message, [status], { authorModel }) {
		const guild = message.guild.memberCount === message.guild.members.size ? message.guild : await message.guild.fetchMembers();
		const guildMembers = guild.members;

		if (!status) return this.modList(message, guildMembers, authorModel);

		const statuses = ['online', 'idle', 'dnd', 'offline'];
		if (!statuses.includes(status)) return message.reply(`that is not a valid status! These are all the valid ones: \`${statuses.join(', ')}\``);
		return this.presenceList(message, guildMembers, status, authorModel);
	}

	presenceList(message, guildMembers, status, authorModel) {
		let mods = [];
		for (const member of guildMembers.values()) {
			if (member.user.bot) continue;
			if (!message.channel.permissionsFor(member).has(['KICK_MEMBERS', 'BAN_MEMBERS'])) continue;
			if (member.presence.status !== status) continue;
			mods.push(member.toString());
		}
		if (!mods.length) return message.reply(`there are no mods on **${status}** status`);
		mods = mapIterator(mods);

		const embed = RichEmbed.common(message, authorModel)
		.setAuthor(`${titleCase(message.guild.name)}'s Mod List`, message.client.user.avatarURL)
		.setDescription('The ModList is generated by taking all the members with the `Kick Members` and `Ban Members` permissions')
		.addField(`${titleCase(status)} Mods`, mods);
		return message.channel.send(embed);
	}

	modList(message, guildMembers, authorModel) {
		let mods = new Set();
		for (const member of guildMembers.values()) {
			if (member.user.bot) continue;			
			if (!message.channel.permissionsFor(member).has(['KICK_MEMBERS', 'BAN_MEMBERS'])) continue;
			mods.add(member);
		}
		
		const embed = RichEmbed.common(message, authorModel)
		.setAuthor(`${titleCase(message.guild.name)}'s Mod List`, message.client.user.avatarURL)
		.setDescription('The ModList is generated by taking all the members with the `Kick Members` and `Ban Members` permissions');

		const online = [];
		const idle = [];
		const dnd = [];
		const offline = [];
		for (const mod of mods.values()) {
			if (mod.presence.status === 'online') online.push(mod.toString());
			if (mod.presence.status === 'idle') idle.push(mod.toString());
			if (mod.presence.status === 'dnd') dnd.push(mod.toString());
			if (mod.presence.status === 'offline') offline.push(mod.toString());
		}

		if (online.length) embed.addField('Online <:online:339191830140944385>', mapIterator(online), true)
		if (idle.length) embed.addField('Idle <:idle:339191829515993089>', mapIterator(idle), true)
		if (dnd.length) embed.addField('Do Not Disturb <:dnd:339191829524381716>', mapIterator(dnd), true)
		if (offline.length) embed.addField('Offline <:offline:339191829218066433>', mapIterator(offline), true);

		return message.channel.send(embed);
	}
}

module.exports = ModListCommand;
