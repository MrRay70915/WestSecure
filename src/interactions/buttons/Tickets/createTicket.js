const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]

module.exports = {
  name: filename,
  async execute(client, interaction) {
      const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('Choose a reason for the ticket');
            selectMenu.addOptions([
                {
                    emoji: 'ℹ️',
                    label: 'General Question',
                    description: 'Have a question, then please ask us.',
                    value: 'newTicket_Info'
                },
                {
                    emoji: '🚫',
                    label: 'Report a player',
                    description: 'Used for reporting players for breaking the rules',
                    value: 'newTicket_Report'
                },
                {
                    emoji: '💰',
                    label: 'Purchase Error',
                    description: 'An purchase error occured',
                    value: 'newTicket_Purchase'
                },
                {
                    emoji: '🔧',
                    label: 'Data loss',
                    description: 'Your data has been corrupted or lost',
                    value: 'newTicket_Dataloss'
                },

            ]);

            const row = new MessageActionRow().addComponents(selectMenu);

            return interaction.reply({ content: 'What will be the reason for the ticket ?', components: [row], ephemeral: true });
  }
}

