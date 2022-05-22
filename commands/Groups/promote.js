const {Discord, Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const fetch = require('https');
const roblox = require("noblox.js")


async function checkDatabase(client, id) {
  let alreadyInDB = await client.database.verify.getDiscordId(id)
  let stringify = JSON.stringify(alreadyInDB)
  const replaced = stringify.replace('[', '');
  const replaced2 = replaced.replace(']', '');
  const replaced3 = replaced2.replace('"', '');
  const replaced4 = replaced3.replace('"', '');
  const boolval = replaced4.split(",")[0]
   if (boolval == "true"){
    const discordid = replaced4.split(",")[1]
    return discordid
  }else{
    return false
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
  function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }
  if(!args[0]) return message.channel.send({embeds: [embedMaker('', "RED", `Invalid Arguments \`${client.getArgs("promote")}\``)]});
  const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation} your request is pending please wait`)]});;
  const settings = message.settings = await client.WestSecure.lookUp(message.guild);
  const groupID = message.settings.groupID.value
  if(groupID == undefined)  editmsg.edit({embeds: [embedMaker('Invalid Answer', "RED", `${client.config.emojis.x} You havent specified your main group please do so by running \`;config groupID <groupid>\` `)]});;

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
  
  let rbxID
  let rlbxusername
  
  
  try {
    rbxID = await roblox.getIdFromUsername(robloxname);
    rlbxusername = await roblox.getUsernameFromId(rbxID)
  } catch {
    return editmsg.edit({embeds: [embedMaker('Invalid Username', "RED", `${client.config.emojis.x} The username that you supplied isn't a valid Roblox username`)]});
  }

  const groupInfo = await roblox.getGroup(groupID)
  
  .then(async(groupinf) => {

    try {
        let oldRankID = await roblox.getRankInGroup(groupID, rbxID);
        let oldRankName = await roblox.getRankNameInGroup(groupID, rbxID);
        
        try {
          await roblox.promote(groupID, rbxID);
        } catch (err) {
          return  editmsg.edit({embeds: [embedMaker("Request Rejected", "RED", `${client.config.emojis.x} There was an error while attempting to promote ${rlbxusername}: ${err}`)]});
        }
        let newRankID = await roblox.getRankInGroup(groupID, rbxID);
        let newRankName = await roblox.getRankNameInGroup(groupID, rbxID);
        editmsg.edit({embeds: [embedMaker(`${client.config.emojis.check} Successfully Promoted`, "#3CB371", `You have successfully promoted ${rlbxusername} from ${oldRankName} (${oldRankID}) to ${newRankName} (${newRankID})`)]});
      
         
    } catch (err) {
        
        return editmsg.edit({embeds: [embedMaker("", "RED", `${client.config.emojis.x} There was an error while attempting to promote ${rlbxusername}: ${err}`)]});
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
    aliases: [],
    userPermissions: ["MANAGE_ROLES", "KICK_MEMBERS"],
    disablable: false,
    premium: false,
    slashOptions: []
  };
    
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "promote a roblox user in the main specified group",
    usage: `${filename} <RobloxName>`
};
