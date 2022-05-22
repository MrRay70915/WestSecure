const { MessageEmbed, UserFlags, GuildMember } = require('discord.js');
const noblox = require('noblox.js')
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
  function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    //embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }
    if(!args[0] || !args[1]) return message.channel.send({embeds: [embedMaker('', "RED", `${client.config.emojis.x} Invalid Arguments. Usage: \`${client.getArgs(filename)}\``)]});

    const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation} your request is pending please wait`)]});
    const settings = message.settings = await client.WestSecure.lookUp(message.guild);
    if(settings["verification"].value !== true) return editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)]});
    
    
    

    if(settings.verifiedRole.value == undefined || settings.verifiedRole.value == false) return editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emojis.x} Error: cannot find verified role. Please fix this in the config`)]});

    const roleValue = settings.verifiedRole.value.replace("<#", "").replace(">", "")
    const verifiedRole = client.getRole(message.guild, roleValue)
    // Find verified role
    const guild = message.guild
    if(verifiedRole == undefined) return editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emoji.x} Error: cannot find verified role. Please fix this in the config`)]});
    
    // Find unverified role
    const roleValue2 = settings.unverifiedRole.value.toString().replace("<#", "").replace(">", "")
    const unverifiedRole = client.getRole(message.guild, roleValue2)

    // Get the user
    const userLookup = client.findUser(message, args[0])
    if(userLookup[0] == false) return editmsg.edit(userLookup[1]);
    const user = userLookup[1]

    // Checking to make sure they are not already verified
    const count = await client.database.verify.count(user.user.id)
    if(count !== 0) return editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emoji.x} Error: This user may already be verified.`)]});
    
    // Get data from roblox.
    const raw = args[1]
    let UserID
    let RobloxUsername
    try {
        UserID = await noblox.getIdFromUsername(raw)
        RobloxUsername = await noblox.getUsernameFromId(UserID)
    } catch (error) {
        editmsg.edit({embeds: [embedMaker('', "RED", `API ${error.name}: ${error.message}`)]});
        
    }

    // Ready to edit the keys
    const results = await client.database.verify.write(RobloxUsername, UserID, user.user.id)
    //if(results[0] == false) return editmsg.edit({content: results[1]});
    editmsg.edit({embeds: [embedMaker('Successfully Verified', "#3CB371", `Successfully Verified \`${user.user.tag}\` as \`${RobloxUsername}\``)]});
    
    client.verification.bindRoles(user, UserID)
    client.database.verify.event(user.user.tag, RobloxUsername, UserID, "Manual Verification", `Verified By ${message.author.tag}`, message.guild.name)
    // Edit roles

    try {
        if(unverifiedRole !== undefined) user.roles.remove(unverifiedRole);
    } catch (error) {
        editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emojis.exclamation} An error has occured and the role was not removed. ${error.name}: ${error.message}`)]});
        
    }
    try {
        user.roles.add(verifiedRole)
    } catch (error) {
      editmsg.edit({embeds: [embedMaker('', "RED", `${client.config.emojis.exclamation} An error has occured and the role was not added. ${error.name}: ${error.message}`)]});
    }
    if(message.settings.setnick.value == true) {
        try {
            user.setNickname(RobloxUsername)
        } catch (error) {
            
        }
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Manually verify's a user.",
    usage: `${filename} <user> <roblox username>`
};
