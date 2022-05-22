const { Discord, MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const https = require('https');
const noblox = require("noblox.js")
const RBX = require("@mfd/rbxdatastoreservice")

function getUserFromMention(client, mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    //embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
}

exports.run = async (client, message, args, level) => {
  let user
  if (!args[0]){
    user = message.member.nickname
  }
  
  const pending = client.defaultEmbed()
  .setTitle(`:information_source: Requesting information`)
  .setDescription(`Please hold while we request information the users game profile`)
  const msg = await message.reply({ embeds: [pending], allowedMentions: { repliedUser: true }})

  try{
    const user = await noblox.getIdFromUsername(args.join(" "))
    const playerInfo = await noblox.getPlayerInfo({userId: user})
    let DataStoreService = RBX.DataStoreService;
    let DataStore = DataStoreService.GetDataStore('PlayerData-v0.2', 'global');
    let value = await DataStore.GetAsync(`Player_${user}`);
    if (value == undefined){
      msg.edit({embeds: [embedMaker(`${client.config.emojis.x} Error 404: Not Found`, "RED", `\`${playerInfo.username}\` has never played Westlake, if this is incorrect please notify Rayray!`)]})
      return
    }
    let lastUpdate = value.MetaData.LastUpdate

    var lastUpdateDate = new Date(0)
    lastUpdateDate.setUTCSeconds(lastUpdate);

    
  


    const embed = client.defaultEmbed()
    embed.setTitle(`In-game information on ${playerInfo.username}`)
    embed.setDescription(`${playerInfo.username}'s data was created on \nTheir data was last updated on **${lastUpdateDate.getMonth()+1}-${lastUpdateDate.getDate()}-${lastUpdateDate.getFullYear()}**`)
    embed.setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
    console.log(value)
     msg.edit({embeds:[embed]})
  }catch(err){
    msg.edit({embeds: [embedMaker(`${client.config.emojis.x} Unexpected Error`, "RED", `**${err.message}**`)]})
  }
  
  



  //if(user == undefined) return pending.edit(embeds:[embedMaker(`${client.config.emojis.x} 404: Not Found`, "RED", `${user} was not found, are you sure you spelled everything right?`)])

  
  
  

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
