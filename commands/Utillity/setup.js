const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = (client, message, args, level) => {

   
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send('You need to have the **manage messages** permission to use this command ❌');
        }

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('GREEN');
        setupEmbed.setAuthor('Tickets system\nTo create a ticket click on the reaction below 🤝');
        setupEmbed.setDescription('*A new channel will be created for you to talk with the team members !*');

        const ticketButton = new MessageButton();

        ticketButton.setEmoji('🔓');
        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Open a ticket');
        ticketButton.setCustomId('createTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
  
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Adminstrator",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "helps you with getting help",
    usage: `${filename}`
};
