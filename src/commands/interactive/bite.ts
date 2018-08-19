import { Collection, Message, Snowflake } from 'discord.js';

import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { WeebCommand } from '../../structures/WeebCommand';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';
import { IWeebResolvedMember } from '../../types/weeb/IWeebResolvedMember';

class CuddleCommand extends WeebCommand {
	public constructor(handler: CommandHandler) {
		super(handler, {
			action: 'bit',
			description: 'Bite someone!',
			emoji: '<:kannaShy:458779242696540170>',
			examples: ['bite kanna', 'bite kanna wizard'],
			name: 'bite',
			type: 'bite',
			usage: 'bite <...User>',
		});
	}

	public async run(
		message: Message,
		[members]: [Collection<Snowflake, IWeebResolvedMember>],
		{ authorModel, commandName }: ICommandRunInfo,
	): Promise<Message | Message[]> {
		const embed: MessageEmbed = await this.fetchEmbed(message, authorModel, members, {
			bot: `W-why did you bite me **${message.member.displayName}**?`,
			dev: `Why did you bite ${members.first().name}!?`,
			trusted: `${message.author}... Stop!`,
		});
		const baseString: string = this.computeBaseString(message, members);

		return message.channel.send(baseString, embed);
	}
}

export { CuddleCommand as Command };
