const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]

module.exports = {
  name: filename,
  async execute(client, int) {
            const reason = int.values[0].split('_')[1];
            if (int.member.id == "595721141663039528") return;
            const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);
           
            if (!channel) {
                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    topic: `Ticket created by ${int.member.user.username}${reason ? ` (${reason})` : ''} ${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`Your ticket has been successfully created ${int.member.user.username}${reason ? ` (${reason})` : ''} ✅`);
                ticketEmbed.setDescription('*To close the current ticket click on the reaction below, warning it is impossible to go back !*');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Close this ticket');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({content:`|| <@${int.member.id}> || `, embeds: [ticketEmbed], components: [row] });
                
                const setupEmbed = client.defaultEmbed()
                setupEmbed.setColor('GREEN');
                setupEmbed.setAuthor('Ticket created');
                setupEmbed.setDescription(`Your ticket has been successfully created <#${channel.id}>`);
                

                int.update({embeds: [setupEmbed],components: [], ephemeral: true });

               
                
            } else {
                const errorEmbed = client.defaultEmbed()
                errorEmbed.setColor('RED');
                errorEmbed.setAuthor('An error occured');
                errorEmbed.setDescription(`You already have an open ticket <#${channel.id}> `);
                return int.update({ embeds: [setupEmbed], components: [], ephemeral: true });
            }
        }
}

