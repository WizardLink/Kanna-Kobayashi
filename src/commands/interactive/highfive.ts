import { Collection, Message, Snowflake } from 'discord.js';

import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { WeebCommand } from '../../structures/WeebCommand';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';
import { IWeebResolvedMember } from '../../types/weeb/IWeebResolvedMember';

class HighFiveCommand extends WeebCommand {
	public constructor(handler: CommandHandler) {
		super(handler, {
			action: 'high-fived',
			aliases: ['high5'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'High-five with someone! :3',
			emoji: '<:KannaHug:299650645001240578>',
			examples: ['highfive kanna', 'highfive kanna wizard'],
			name: 'highfive',
			type: 'highfive',
			usage: 'highfive <...User>',
		});
	}

	public async run(
		message: Message,
		[members]: [Collection<Snowflake, IWeebResolvedMember>],
		{ authorModel }: ICommandRunInfo,
	): Promise<Message | Message[]> {
		const embed: MessageEmbed = await this.fetchEmbed(message, authorModel, members, {
			bot: 'Yay! <:KannaHug:299650645001240578>',
			dev: `High-five with me **${message.author}**! <:KannaHug:299650645001240578>`,
			trusted: `High-five with me **${message.author}**! <:KannaHug:299650645001240578>`,
		});
		const baseString: string = this.computeBaseString(message, members);

		return message.channel.send(baseString, embed);
	}
}

export { HighFiveCommand as Command };