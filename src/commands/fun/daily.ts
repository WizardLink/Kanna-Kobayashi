import { Message } from 'discord.js';

import { Command } from '../../structures/Command';
import { CommandHandler } from '../../structures/CommandHandler';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';


class DailyCommand extends Command {
	public constructor(handler: CommandHandler) {
		super(handler, {
			aliases: ['dailies'],
			coins: 300,
			// One day 24 hours * 60 minutes * 60 second * 1000 milliseconds
			cooldown: 24 * 60 * 60 * 1000,
			description: 'Your daily 500 coins!',
			examples: ['daily'],
			name: 'daily',
			usage: 'daily',
		});
	}

	public run(message: Message, _: string[], { authorModel }: ICommandRunInfo): Promise<Message | Message[]> {
		const grantedCoins: number = authorModel.tier * this.coins;

		return message.reply(`here are your daily **${grantedCoins}** <:coin:330926092703498240>!`);
	}
}

export { DailyCommand as Command };