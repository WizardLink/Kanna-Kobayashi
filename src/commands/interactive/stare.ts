import { Collection, Message, Snowflake } from 'discord.js';

import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { WeebCommand } from '../../structures/WeebCommand';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';
import { IWeebResolvedMember } from '../../types/weeb/IWeebResolvedMember';

class StareCommand extends WeebCommand {
	public constructor(handler: CommandHandler) {
		super(handler, {
			action: 'is staring at',
			description: 'Stare at someone <:kannaMad:458776169924526093>',
			emoji: '<:kannaScared:458776266154180609>',
			examples: ['stare kanna', 'stare kanna wizard'],
			name: 'stare',
			type: 'stare',
			usage: 'stare <...User>',
		});
	}

	public async run(
		message: Message,
		[members]: [Collection<Snowflake, IWeebResolvedMember>],
		{ authorModel }: ICommandRunInfo,
	): Promise<Message | Message[]> {
		const embed: MessageEmbed = await this.fetchEmbed(message, authorModel, members, {
			bot: '_runs_',
			dev: `**${members.first().name}**... Run!`,
			trusted: `**${members.first().name}**... Run!`,
		});
		const baseString: string = this.computeBaseString(message, members);

		return message.channel.send(baseString, embed);
	}
}

export { StareCommand as Command };
