const { MessageEmbed } = require('discord.js');
const { getUsernameFromId } = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    let newMsg
    function embedMaker(title, color, description) {
      let embed = new MessageEmbed();
      embed.setColor(color);
      //embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      embed.setTitle(title);
      embed.setDescription(description);
      return embed;
    }
    const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation} your request is pending please wait`)]});;
    
    const settings = message.settings = await client.WestSecure.lookUp(message.guild);
    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)

    if(!args[0]){
   
        const isVerified = await client.database.verify.count(message.author.id) == 1
        if(isVerified == false) return editmsg.edit({embeds: [embedMaker('Error 404', "RED", `${client.config.emojis.exclamation} you have not been found in the database, are you sure you have verified before?`)]});
        const rawdata = await client.database.verify.read(message.author.id)
        const data = rawdata[1]
        const name = await getUsernameFromId(data.RobloxID)
       try{editmsg.delete()}catch(e){}
        const mesage = `${client.config.emojis.exclamation} Are you sure to unlink from: \`${name}\` you will lose the guild's verified roles and have to reverify. (respond \`yes\` or \`no\`)`
        
        newMsg = await message.channel.send({embeds: [embedMaker('Unlinking', "RED", `${client.config.emojis.exclamation} Are you sure to unlink from: \`${name}\` you'd have to reverify. (respond \`yes\` or \`no\`)`)]});

        const filter = m => m.content.toLowerCase().includes("yes") || m.content.toLowerCase().includes("no") && m.author.id == message.author.id ;
        const collector = message.channel.createMessageCollector({ filter, time: 20000 });

        
        
        collector.on('collect', async (m) => {
            collector.stop()
            if (m.content.toLowerCase().includes("yes") ){
              remove(message.author, message.member, name);
              
            }else if(m.content.toLowerCase().includes("no")){
              
              return newMsg.edit({embeds: [embedMaker('Cancelled', "RED", `${client.config.emojis.check} Action has been cancelled`)]});
            }
           
          });

          collector.on('end', collected => {
            if (collected.size == 0 ){
                return newMsg.edit({embeds: [embedMaker('Cancelled', "RED", `${client.config.emojis.check} Action has been cancelled, timed out!`)]});
            }
           
          });


     
    }
    else {
        if(level < 2) return message.channel.send(`${client.config.emojis.x} Admin permissions are required to unlink other users.`)
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) return message.channel.send(`${rawuser[1]}`)
        const member = rawuser[1]
        const isVerified = await client.database.verify.count(member.user.id) == 1
        if(isVerified == false) return message.channel.send(`${client.config.emojis.x} User does not have a record to unlink.`);
        const data = await client.database.verify.read(member.user.id)
        const name = data[1].RobloxUsername
        remove(member.user, member, name)
    }
    async function remove(user, member, rblxName){
        await client.database.verify.remove(user.id)
        try{
          newMsg.delete()
        }catch(e){
          
        }
        const editingLol = await message.channel.send({embeds: [embedMaker('Unlinking Succeeded', `
#18A558`, `${client.config.emojis.check} \`${user.tag}\` is no longer verified as \`${rblxName}\``)]});
       // remRoles(member)
    }

    function remRoles(member){
        member.roles.cache.forEach(role => {
            if(role.name !== "@everyone"){
                try{ member.roles.remove(role); } catch(err) {}
            }
        })
        member.roles.remove(verifiedRole);
        try {if(unverifiedRole !== undefined || member.roles.get(unverifiedRole.id)) member.roles.add(unverifiedRole);} catch (error) {} 
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["unverify"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Unlinks you from your roblox account",
    usage: `${filename} [User (admin perms required)]`
};
