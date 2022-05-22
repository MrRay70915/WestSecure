const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]

module.exports = {
  name: filename,
  async execute(client, int) {
      const channel = int.guild.channels.cache.get(int.channelId);
      const errorEmbed = client.defaultEmbed()
      errorEmbed.setColor('RED');
      errorEmbed.setAuthor('TICKET DELETING');
      errorEmbed.setDescription(`Ticket has been closed, channel will be deleted in **5** seconds! `);
      int.update({ embeds: [errorEmbed], components: [], ephemeral: true });


      //const channel = int.guild.channels.cache.get(int.channelId);
      const logchannel = int.guild.channels.cache.get("915083678726635580");
            const logembed = client.defaultEmbed()
            const ticketID = Date.now();

            logembed.setColor('GREEN');
            logembed.setAuthor(`Ticket Transcript`);
            logembed.setDescription(`Ticket ID: ${channel.name.split('-')[1]}\nTicket opened by: <@${channel.name.split('-')[1]}>\n**${new Date(ticketID).toLocaleString()}**`);
            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket creator)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'There are no messages in this ticket... strange';

                
                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`User ticket ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                //stream.on('finish', () => logchannel.send({files: [`./data/${ticketID}.txt`]})
                
                //logchannel.send({files: [`./data/${ticketID}.txt`]})
                //, files: [`./data/${ticketID}.txt`]
                
                //);
            });



      setTimeout(function () {
           return channel.delete();
      }, 5000)
      
  }
}

