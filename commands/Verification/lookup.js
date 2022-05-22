const { MessageEmbed } = require('discord.js');
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
        
        //const uri = `https://api.roblox.com/users/${user.toString()}/onlinestatus`;
        //231321321321
        const uri = `https://api.roblox.com/users/${user.toString()}/onlinestatus`;
        const userInfo = await fetch(uri).then(response => response.json())

        
        
        let OldNames = playerInfo.oldNames.join("\n")
        if(OldNames == "") OldNames = "None"
        const westDB = await client.database.verify.readROBLOXID(user)
        let westDesc = "No info was found"
        if(westDB[0] == true) {
            const member = message.guild.members.cache.get(westDB[1].DiscordID)
            if(member!== undefined) {
                const disUser = message.guild.members.fetch(westDB[1].DiscordID)
                westDesc = `**Discord Tag**: \`${member.user.tag}\`\n**Discord ID**: \`${member.id}\`\n\n<@${member.id}>`
            } else westDesc = `**Discord ID**: ${westDB[1].DiscordID}`
        }
        let desc = playerInfo.blurb.substring(0, 999) !== "" ? playerInfo.blurb.substring(0, 999) : "No Description";

        const miliseconds = parseInt(playerInfo.age) * 24 * 60 * 60 * 1000;
        const duration = moment.duration(miliseconds).format("Y [years], M [months] & D [days]");

        const embed = client.defaultEmbed()
            embed.setTitle(`Info on ${playerInfo.username}`)
            
            embed.setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
            embed.addField("Roblox Username", `[${playerInfo.username}](https://www.roblox.com/users/${user}/profile)`, true)
            //.addField("Roblox ID", user, true)
            
            if (!userInfo.errors){
              let currentOnly = boolToWord(userInfo.IsOnline)
              let date = new Date(userInfo.LastOnline)
              
              embed.addField("Currently Online", currentOnly, true)
              if (!userInfo.IsOnline){
                embed.addField("Last Online", `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`, true)
                embed.setColor("#C0C0C0")
              }else{
                let presence = getPresence(userInfo.LocationType)
                embed.addField("Current Actvity", presence, true)
                if (presence == "Website"){
                  embed.setColor("#00A2FF")
                }else if(presence == "In Game"){
                  embed.setColor("#02B757")
                }else if(presence == "In Studio"){
                  embed.setColor("#F68802")
                }else if(presence == "Studio w/ Team Create"){
                  embed.setColor("#F68802")
                }
              }
            };
            
            embed.addField("Account Age", `${duration} old\n(${playerInfo.joinDate.getFullYear()}-${playerInfo.joinDate.getMonth() + 1}-${playerInfo.joinDate.getDate()})`, true)
            embed.addField("Stats", `Friends: \`${playerInfo.friendCount}\`\nFollowers: \`${playerInfo.followerCount}\``, true)
            embed.addField("Old Names", `\`\`\`\n${OldNames.substring(0, 999)}\`\`\``, false)
            embed.addField("Description", `\`\`\`\n${desc.substring(0, 500)}\n\`\`\``);
            if (westDB[0] == true){
                embed.addField("WestAPI Info", `${westDesc}`, true)
            } 
       // westDB[0] == true ? embed.addField("WestSecure DB Info", `${westDesc}`, true) : undefined;
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
    aliases: ["robloxsearch", "find", "rblxseach", "robloxinfo"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Search for a roblox user.",
    usage: `${filename} <Roblox Username/Discord Mention>`
};
