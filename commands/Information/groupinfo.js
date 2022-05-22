const Discord = require("discord.js");
const filename = require('path').basename(__filename).split(".")[0]
const https = require('https');
const noblox = require("noblox.js")
const cooldowns = new Discord.Collection();
exports.run = async (client, message, args, level) => {
  let embed = client.defaultEmbed()
  embed.setTitle("AN ERROR OCCURED")
  embed.setDescription(`No GroupID provided. Usage: \`${client.commands.get(`${filename}`).help.usage}\``);
  embed.setColor("#de554e");
  if(!args[0]) 
  return await message.reply({ embeds: [embed], allowedMentions: { repliedUser: true }})
  let groupId = args[0]
  let uri = "https://groups.roblox.com/v1/groups/" + args[0];
  let uri2 = `https://groups.roblox.com/v1/groups/${args[0]}/roles`;
  let roles 
  
  const pending = client.defaultEmbed()
  .setTitle(`:information_source: Requesting information`)
  .setDescription(`Please hold while we request information about the following group ID: ${args[0]}`)
  const msg = await message.reply({ embeds: [pending], allowedMentions: { repliedUser: true }})
  //const msg = await message.channel.send({embeds: [pending]});

  
  
  https.get(uri, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', async() => {
    
    let dataReceived = JSON.parse(data)
    if (dataReceived.errors){ 
      console.log("ERROR")
      let embed = client.defaultEmbed()
      embed.setAuthor(":x: GROUP NOT FOUND")
      embed.setDescription(`The groupId: **${args[0]}** is invalid or does not exist.`);
      embed.setColor("#de554e");
     msg.edit({ embeds: [embed] });
     
      //return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true }})
    }else{
      let entryallowed = dataReceived.publicEntryAllowed.toString()
      if (entryallowed == "false"){
        entryallowed = "No"
      }else{
        entryallowed = "Yes"
      }
      let groupLogo = await noblox.getLogo(dataReceived.id)
      let lenghtof = dataReceived.description.length
      console.log(groupLogo)
      let embed = client.defaultEmbed()
      
      embed.setThumbnail(groupLogo)
      embed.setAuthor(dataReceived.name, '', `https://www.roblox.com/groups/${dataReceived.id}/about`)
      embed.addField('Owned By:', `[${dataReceived.owner.username}](https://www.roblox.com/users/${dataReceived.owner.userId.toString()}/profile) (${dataReceived.owner.displayName})`, true)
     embed.addField('Group ID:', args[0], true)
    
      
      embed.addField('Public Entry Allowed:', entryallowed, true)
     embed.addField('Member Count:', dataReceived.memberCount.toString(), true)
     if (lenghtof > 1) {
        embed.addField('Group Description:', dataReceived.description, false)
      
     }else{
       embed.addField('Group Description:', "No Description", false)
     }
     
    //.addField('Group Roles:', dataReceived.description, false)
    //  .addField('Last Shout:', dataReceived.shout.body, true)
      
      msg.edit({embeds: [embed]});
    }
    
  });

  // The whole response has been received. Print out the result.
  //const pending = client.defaultEmbed()
  //.setTitle(`:information_source: Requesting information`)
  //.setDescription(`Please hold while we request information about the following group ID: ${args[0]}`)
  //const msg = message.reply({ embeds: [pending], allowedMentions: { repliedUser: true }})
  //const msg = await message.channel.send({embeds: [pending]});
  
  

})


  
  
  

}

exports.conf = {
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    aliases: ["ginfo"],
    permLevel: "User",
    disablable: false,
    premium: false,
    slashOptions: []
  };
    
  exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "get information of the selected groupID",
    usage: `${filename} <groupId>`
  };
