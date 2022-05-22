const timeout = new Map()
const Discord = require('discord.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const roblox = require('noblox.js');
const forbidenWords = ["https://tenor.com/view/ssu-roblox-gif-22840985", "https://tenor.com/view/sad-gif-24264245"]

const howtopolice = ["to be police", "to be cop", "be a cop", "apply for cop", "apply for police", "apply to become a cop", "apply to become police"]

function attachIsImage(msgAttach, extraval) {
  if (extraval == true){
    url = msgAttach
    if (url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1){
     return true
    }
    if (url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1){
      return true
    }
    if (url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1){
      return true
    }
    if (url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1){
      return true
    }
    if (url.indexOf("mp4", url.length - "mp4".length /*or 3*/ ) !== -1){
      return true
    }
    return false
  }
  
   var url = msgAttach.url;
   //True if this url is a png image.
  
  if (url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1){
     return true
  }
  if (url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1){
     return true
  }
  if (url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1){
     return true
  }
  if (url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1){
     return true
  }
  if (url.indexOf("mp4", url.length - "mp4".length /*or 3*/ ) !== -1){
     return true
  }
  return false
}

module.exports = async (client, message) => {
     // Like said in the index most of this comes from hue 2.0 which comes from a guide bot, this file is just a complete rip from hue 2 which hasnt changed much from the orginial https://github.com/AnIdiotsGuide/guidebot/blob/master/events/message.js
   
    // if a bot then ignore.
    if (message.author.bot) return;
   // try {client.WestSecure.lookUp(message.guild);} catch (error) {} // initialize it
   // const settings = message.settings = await client.WestSecure.lookUp(message.guild);
  
    
    
    
    let channel = message.channel

   



    if (channel.id == "929059344832684043" ){
      if (message.attachments.size > 0) {
        if (!message.attachments.every(attachIsImage)) {
          const pending = client.defaultEmbed()
          .setTitle(`INVALID FILE`)
          .setColor(`RED`)
          .setDescription(`${client.config.emojis.x} The following file extensions are allowed in this channel:\n‣ **.mp4 | .jpeg | .jpg | .png | .gif**\n*links are also allowed to be send in this channel with the extenstions named above.*`)
          let msg = await message.channel.send({content:`|| <@${message.author.id}> ||` ,embeds: [pending]})
          setTimeout(function(){
           try{
            msg.delete()
           }catch{}
          }, 10000); 
          try{
            message.delete()
          }catch{}
        }
      }else{
        if (!attachIsImage(message.content, true)){
          const pending = client.defaultEmbed()
          .setTitle(`INVALID FILE`)
          .setColor(`RED`)
          .setDescription(`${client.config.emojis.x} The following file extensions are allowed in this channel:\n‣ **.mp4 | .jpeg | .jpg | .png | .gif**\n*links are also allowed to be send in this channel with the extenstions named above.*`)
          let msg = await message.channel.send({content:`|| <@${message.author.id}> ||` ,embeds: [pending]})
          setTimeout(function(){
           try{
            msg.delete()
           }catch{}
          }, 10000); 
          try{
            message.delete()
          }catch{}
        }
      }
    }


    for (var i = 0; i < howtopolice.length; i++) {
      if (message.content.includes(howtopolice[i])) {
       // message.content contains a forbidden word;
        // delete message, log, etc.

        const policembed = client.defaultEmbed()
          .setTitle(`FAQ | How to apply/become a cop`)
          .setColor(`#3CB371`)
          .setDescription(`Whenever a department is looking for new members this will be announced in the discord server.\n‣ Police Department: LETA's(Law Enforcement Training Academy) are hosted periodically when new members are needed in departments. This consist of 4 phases where you will learn laws, game mechanics, etc. Once you're done with the 4 phases you then have to do a final exam in order to apply for the department of your choice!\n\n **‣At the time of writing this, the Fire Department does __not__ exist!**`)
          .addField("Requirements for LETA:", "‣ Valid Driver License\n‣Must be a citizen\n‣~~No Felony Records~~ Not in use")
    
       let msg =  message.reply({ embeds: [policembed], allowedMentions: { repliedUser: true }})
       setTimeout(function(){
           try{
            msg.delete()
           }catch{}
          }, 60000); 
      break;
      }
    } 
    

    if (message.content.indexOf(client.config.prefix) !== 0) return;

    
    
    const args = message.content.slice(client.config.prefix).trim().split(/ +/g);
    const lowerCase = args.shift().toLowerCase();
    const command = lowerCase.slice(";".length)
    
    //const loadCommandOptions = require(`${ROOT.path}/src//CommandOptions/loadCommandOptions`)
    
   
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);
  
  
    const level = client.permlevel(message);

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    if(cmd.conf.enabled == false) return;
 
    
    if (await require(`${ROOT.path}/src/commandoptions/Cooldown.js`)(client, message, cmd.conf, false, false, Discord, command)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/OnlyGuilds`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/OwnerOnly`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/UserPermissions`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/ClientPermissions`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/AnyUserPermissions`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/AnyClientPermissions`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/RequiredRoles`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/RequiredAnyRole`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/OnlyChannels`)(client, message, cmd.conf, Discord)) return;
    else if (await require(`${ROOT.path}/src/commandoptions/OnlyUsers`)(client, message, cmd.conf, Discord)) return;
    //else {
   // if (isInteraction) command.run(client, message, Discord)
   // }


    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send(`${client.config.emojis.x} This command is unavailable in DMs. Please run in a Server.`);
 

    if (level < client.levelCache[cmd.conf.permLevel]) {
        return message.channel.send(`${client.config.emojis.x} Invalid Permission Level.
    Your permission level is ${level} (${client.config.permissionLevels.find(l => l.level === level).name})
    This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      
    }
    
    /*let userCooldowns = client.cooldowns.get(cmd.name);
    let cooldownAmount = (cmd.conf.cooldown || 3) * 1000;
    if(cmd.conf.cooldown) {
        if(!client.cooldowns.has(command)) {
            client.cooldowns.set(command, new Discord.Collection());
        }
        let currentDate = Date.now();
        let userCooldowns = client.cooldowns.get(command);
        let cooldownAmount = (cmd.conf.cooldown || 3) * 1000;
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
    }*/

    
    message.author.permissionLevels = level;
    
    const emojis = Object.entries(client.config.emojis)
    emojis.forEach(emoji => {
      message[emoji[0]] = emoji[1]
    })

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
 
    const guildType = message.channel.type == "DM" 
    //client.logger.cmd(`GUILD: ${guildType} | L${level} ${message.author.username} ran ${cmd.help.name}`);
    try {
      await cmd.run(client, message, args, level)
    } catch (error) {
      message.channel.send(client.errorEmbed(error))
      client.logger.log(`COMMAND ERROR => ${error.name}: ${error.message}`)
    }
    return
  };