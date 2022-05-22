const {Discord, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const fetch = require('https');
const roblox = require("noblox.js")


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
  function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }
 if(!args[0]) return message.channel.send({embeds: [embedMaker('', "RED", `Invalid Arguments \`${client.getArgs("joinrequest")}\``)]});
  const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation}your request is pending please wait`)]});;
  const settings = message.settings = await client.WestSecure.lookUp(message.guild);
  const groupID = message.settings.groupID.value
  if(groupID == undefined)  editmsg.edit({embeds: [embedMaker('Invalid Answer', "RED", "You havent specified your main group please do so by running `;config groupID <groupid>`")]});;
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
  
  const robloxname = args[0]
  const yesorno = args[1]  
  let rbxID
  let rlbxusername
  
  if( !yesorno ||!yesorno.toLowerCase()== "yes"|| !yesorno.toLowerCase()== "no"){
    return editmsg.edit({embeds: [embedMaker('Invalid Answer', "RED", "You have to say yes or no in order to deny or accept the request")]});
  }
  try {
    rbxID = await roblox.getIdFromUsername(robloxname);
    rlbxusername = await roblox.getUsernameFromId(rbxID)
  } catch {
    return editmsg.edit({embeds: [embedMaker('Invalid Username', "RED", "The username that you supplied isn't a valid Roblox username")]});
  }

  const groupInfo = await roblox.getGroup(groupID)
  
  .then(async(groupinf) => {

    try {
        let answer
        if(yesorno.toLowerCase()== "yes"){
          answer = true
        }else if(yesorno.toLowerCase()== "no"){
          answer = false
        }
        
        await roblox.handleJoinRequest(groupID, rbxID, answer);
        if (answer == false){
          editmsg.edit({embeds: [embedMaker("Request Rejected", "RED", `Succesfully ejected ${rlbxusername}'[${rbxID.toString()}]'s join request'`)]});
        }else{
          editmsg.edit({embeds: [embedMaker("Request Accepted", "#3CB371", `Succesfully accepted ${rlbxusername}'[${rbxID.toString()}]'s join request'`)]});
        }
    } catch (err) {
        
        return editmsg.edit({embeds: [embedMaker("Error", "RED", `There was an error while attempting to accept ${rlbxusername}[${rbxID.toString()}] join request:\n${err}`)]});
    }

    /*const usersRank = await roblox.getRankInGroup(groupID, authorID);
    const userRankObject = await roblox.getRole(groupID, usersRank);
    const userPermissions = (await roblox.getRolePermissions(groupID, userRankObject.ID)).permissions;
    const canUserManageJoins = userPermissions.groupMembershipPermissions.inviteMembers;
    if(canUserManageJoins == false) {
      const embed = client.defaultEmbed()
      embed.setTitle(`Invalid Permissions`)
      embed.setAuthor("An error occured")
      embed.setDescription(`I cannot view or manage join request in **${groupinf.name}**!`);
      embed.setColor("#de554e");
      return message.reply({embeds: [embed]})
    }*/

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
    aliases: ["jr", "joinreq"],
    userPermissions: ["MANAGE_ROLES", "KICK_MEMBERS"],
    disablable: false,
    premium: false,
    slashOptions: []
  };
    
  exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Handle a join request from a roblox user",
    usage: `${filename} <RobloxName> <yes/no>`
  };
