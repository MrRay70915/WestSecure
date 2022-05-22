module.exports = async (client, interaction) => {
    
		let _interaction = null;
    const interactionName = interaction.customId
    const filename = require('path').basename(interactionName).split("_")[0]
		if (interaction.isCommand()) {
			//_interaction = client.commands.get(interaction.commandName);
		} else if (interaction.isButton()) {
			_interaction = client.buttons.get(filename);
		} else if (interaction.isSelectMenu()) {
			_interaction = client.selects.get(filename);
		}

		if (!_interaction) return;

		try {
			await _interaction.execute(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while running this interaction!', ephemeral: true });
		}

};