module.exports = async function (client, message, command, Discord) {
    if (client.config.AuthorizedUsers.some(id => message.member.user.id == id)) return false
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
            else message.reply({
            embeds: [new Discord.MessageEmbed()
         .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
     .setColor("RED")
     .setTimestamp()
     .setDescription(`You require any one of these permissions to be able to run this command..\n• ${command.anyUserPermission.join("\n•")}`)],
     allowedMentions: {
         repliedUser: false
     }
         })
    return true;
}
}