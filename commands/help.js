const Command = require('../engine/commandClass');
const Util = require('../util/helpUtil');

module.exports = class Help extends Command
{
  constructor(client)
  {
    super(client,
    {
      alias: ['halp'],
      description: 'Display all available commands',
      usage: 'help <command>',
      example: ['help', 'help ping'],
      name: 'help',
      exp: 0,
      coins: 0,
      enabled: true
    });
  }

  async run(client, message, color, args, perms)
  {
    if(!message.guild.me.permissions.has('ADD_REACTIONS')) return message.channel.send(`I don't have permission to add reactions!`);

    let util = new Util(client, message, args, color);

    if(!args[0])
    {

      const embeds = {
        ['1']: util.categoryMap('common', 'Common'),
        ['2']: util.categoryMap('int', 'Interactive'),
        ['3']: util.categoryMap('gen1', 'Memes Generation 1'),
        ['4']: util.categoryMap('gen2', 'Memes Generation 2'),
        ['5']: util.categoryMap('gen3', 'Memes Generation 3'),
        ['6']: util.categoryMap('gen4', 'Memes Generation 4'),
        ['7']: util.categoryMap('event', 'Event'),
        ['8']: util.categoryMap('mod', 'Moderation'),
        ['9']: util.categoryMap('unique', 'Unique Commands')
      }

      let msg = await message.channel.send({embed : embeds['1']});

      let emojis = ['⬅', '➡', '❎'];

      for (let emo of emojis)
      {
        await msg.react(emo);
      }

      let number = 1;

      function selectEmbed(choose)
      {
        choose === '➡' ? number++ : number--;
        if(number > 9) number = 0;
        if(number < 0) number = 8;
        if(number === 7 && perms < 1) number = 1;
        if(number === 8 && perms < 2) number = 2;
        if(number === 9 && perms < 3) number = 3;
        return embeds[number.toString()];
      }

      let filter = (r, u) =>
      {
        return emojis.includes(r.emoji.name) && u.id === message.author.id;
      }

        let collector = msg.createReactionCollector(filter, {time : 900000});
        collector.on('collect', async(c) =>
      {
        if(c.emoji.name === '➡')
        {
          await msg.edit({embed : selectEmbed('➡')});
        }
        if(c.emoji.name === '⬅')
        {
          await msg.edit({embed : selectEmbed('⬅')});
        }
        if(c.emoji.name === '❎')
        {
          await message.delete();
          await msg.delete();
        }
      });
    }
    else
    {
      util.findCmd(color);
    }
  }
}