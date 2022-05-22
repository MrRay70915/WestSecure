const {Discord, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const fetch = require('https');
const roblox = require("noblox.js")




exports.run = async (client, message, args, level) => {
  function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }
  
  const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", "your request is pending please wait")]});;
  const settings = message.settings = await client.WestSecure.lookUp(message.guild);
  const groupID = message.settings.groupID.value
  if(groupID == undefined)  editmsg.edit({embeds: [embedMaker('Invalid Answer', "RED", "You havent specified your main group please do so by running `;config groupID <groupid>` ")]});;
  
  
 

  const groupInfo = await roblox.getGroup(groupID)
  
  .then(async(groupinf) => {
    let requests
    try {
        requests = await roblox.getJoinRequests(groupID);
    } catch (err) {
        return editmsg.edit({embeds: [embedMaker("Error", "RED", `There was an error while trying to get join requests:\n ${err}`)]})
    }
     if(requests.data.length == 0) {
        return editmsg.edit({embeds: [embedMaker("Error", "RED", "There are no requests in the group")]});
    }
    let fData = ""
    let embed = embedMaker("Success","#3CB371", `There are ${requests.data.length} join request(s) in the group`);
    for(var i = 0; i < requests.data.length; i++) {
        fData += `**‣ ${requests.data[i].requester.username}[${requests.data[i].requester.userId}]**\n`;
    }
    embed.addField("Requests", fData);
    return editmsg.edit({embeds: [embed]});
  }).catch((error) => {
    editmsg.delete()
    const embed = client.defaultEmbed()
    embed.setTitle(`An error occured`);
    embed.setAuthor(`${error.name === "" ? error.name : error.name + ': '}`);
    embed.setDescription(error.message);
    embed.setColor("#de554e");
    message.reply({embeds: [embed]})
  })
 
}


exports.conf = {
    cooldown: 3,
    enabled: true,
    guildOnly: false,
    aliases: ["jrs", "joinreqs"],
    userPermissions: ["MANAGE_ROLES", "KICK_MEMBERS"],
    disablable: false,
    premium: false,
    slashOptions: []
  };
    
  exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "View all join request for the specified group",
    usage: `${filename}`
  };
