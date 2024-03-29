module.exports = async function (client, message, command, Discord) {
    if (!command.requiredRoles) return false;
    let missing = []
    command.requiredRoles.forEach(role => {
        if (!message.member.roles.cache.has(role)) missing.push(`<@&${role}>`);
    })
    if (missing.length == 0) return false;
    else {
        if (command.returnRequiredRoles == false || command.returnNoErrors) return true;
            else message.reply({
            embeds: [new Discord.MessageEmbed()
         .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
     .setColor("RANDOM")
     .setTimestamp()
     .setDescription(`You are required to have these roles to be able to run this command.\n•${missing.join("\n•")}`)],
     allowedMentions: {
         repliedUser: false
     }
         })
        return true
    }
}