module.exports = async function (client, message, cmd, isInteraction, interactionType, Discord, command) {
    let userCooldowns = client.cooldowns.get(cmd.name);
    let cooldownAmount = (cmd.cooldown || 3) * 1000;
    if(cmd.cooldown) {
        if(!client.cooldowns.has(command)) {
            client.cooldowns.set(command, new Discord.Collection());
        }
        let currentDate = Date.now();
        let userCooldowns = client.cooldowns.get(command);
        let cooldownAmount = (cmd.cooldown || 3) * 1000;
        if(userCooldowns.has(message.author.id)) {
            let expirationDate = userCooldowns.get(message.author.id) + cooldownAmount;
            if(currentDate < expirationDate) {
                let timeLeft = Math.round((expirationDate - currentDate) / 1000);
                let embed = client.defaultEmbed()
                embed.setDescription(`This command is currently on cooldown. Please try again in ${timeLeft.toString()} seconds.`);
                embed.setColor("#de554e");
                return message.channel.send({ embeds: [embed] });
            } else {
                userCooldowns.set(message.author.id, currentDate);
            }
        } else {
            userCooldowns.set(message.author.id, currentDate);
        }
    }
}

