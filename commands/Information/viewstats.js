const { MessageEmbed } = require('discord.js');
const RBX = require("@mfd/rbxdatastoreservice")
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
const moment = require("moment");
const fetch = require('node-fetch');
require("moment-duration-format");

function boolToWord( bool ){
  //...
  var a = bool.toString();
  if(a=='true')
    return 'Yes';
  else
    return 'No';
}

function getPresence(num){
  if (num==0){
    return "Website"
  }else if(num == 1){
    return "In Game"
  }else if(num == 2){
    return "Website"
  }else if(num == 3){
    return "In Studio"
  }else if(num == 4){
    return "In Game"
  }else if(num == 5){
    return "Website"
  }else if(num == 6){
    return "Studio w/ Team Create"
  }
}

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


exports.run = async (client, message, args, level) => {
   // if(!args[0]) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
      const pending = client.defaultEmbed()
    .setTitle(`:information_source: Requesting information`)
    .setDescription(`Please hold while we request information about the roblox user`)
    const msg = await message.reply({ embeds: [pending], allowedMentions: { repliedUser: true }})
    
    if (!args[0]){
      const rawdata = await client.database.verify.read(message.author.id)
      args[0] = rawdata[0]
      const data = rawdata[1]
      args[0] = data.RobloxUsername
       //console.log(rawdataRobloxUsername)
    }
    let mention = getUserFromMention(client, args[0])
    if (mention){
      const rawuser = client.findUser(message, args[0])
      if(rawuser[0] == false) {
        return editmsg.edit({embeds: [embedMaker('Invalid Username', "RED", `${client.config.emojis.x} This user is not verified, please make sure that they are verified in order to continue`)]});
      }
      const user = rawuser[1]
      const rawdata = await client.database.verify.read(user.user.id)
      const data = rawdata[1]
      args[0] = data.RobloxUsername
    }

    try {
        const user = await noblox.getIdFromUsername(args.join(" "))
        
        
        if(user == undefined) return message.channel.send(`${client.config.emojis.x} This user does not exist!`)
        const playerInfo = await noblox.getPlayerInfo({userId: user})
        
        let DataStoreService = RBX.DataStoreService;
        let DataStore = DataStoreService.GetDataStore('PlayerData-v0.1', 'global');
        let value = await DataStore.GetAsync(`Player_${user.toString()}`);
        let data = value.Data

        var d = data.HoursPlayed;
      //var d =val.timestamp;


var date = new Date(+d);

console.log(d);
console.log(date.toDateString());
console.log(date.getFullYear());
console.log(date.getMinutes());
console.log(date.getSeconds());
console.log(date.getHours());
console.log(date.toLocaleTimeString());
        
       
        const uri = `https://api.roblox.com/users/${user.toString()}/onlinestatus`;
        const userInfo = await fetch(uri).then(response => response.json())
       // const timePlayed = moment.unix(data.HoursPlayed).format("DD-MM-YYYY HH:mm:ss");
        
        
        
        const embed = client.defaultEmbed()
        embed.setTitle(`Info on ${playerInfo.username}`)
        embed.setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
      //  embed.addField("Time Played: ", timePlayed)
        
        
        msg.edit({embeds: [embed]})
    } catch (error) {
        const embed = client.errorEmbed({embeds: [error]})
        msg.edit({embeds: [embed]})
    }
}

exports.conf = {
    cooldown: 8,
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Search for a roblox user's in game data.",
    usage: `${filename} <Roblox Username/Discord Mention>`
};
