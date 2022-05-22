const { MessageEmbed, UserFlags, GuildMember } = require('discord.js');
const noblox = require('noblox.js')
const filename = require('path').basename(__filename).split(".")[0]
const moment = require("moment");
const fetch = require('node-fetch');
const maxHeat = 5

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
    //embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }

  if (!args[0]) return end;

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

  const user = await noblox.getIdFromUsername(args.join(" "))

  if(user == undefined) return message.reply({ embeds: [embedMaker("Error 404:", "RED", "This user does not exist, make sure to check for spelling mistakes!")], allowedMentions: { repliedUser: true }})
  const playerInfo = await noblox.getPlayerInfo({userId: user})

  const pending = client.defaultEmbed()
  .setTitle(`:information_source: Requesting information`)
  .setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
  .setDescription(`Please hold while we request information about the roblox user`)
  const msg = await message.reply({ embeds: [pending], allowedMentions: { repliedUser: true }})

  let totalHeat  = 0
  
  let devUrl = `https://devforum.roblox.com/u/${playerInfo.username}.json`
  const devInfo = await fetch(devUrl).then(response => response.json())
  let hasDevAccount = `User does not have a Devforum account ${client.config.emojis.x}`
  if (devInfo.errors){
    totalHeat +=3
  }else{
    hasDevAccount = `User does have a Devforum account ${client.config.emojis.check}`
    if (devInfo.user.trust_level == 0){
        totalHeat  +=1
    }
    hasDevAccount = hasDevAccount + `\nThey have a trust level of **${devInfo.user.trust_level.toString()}**`
    if (devInfo.user.badge_count <= 2){
        hasDevAccount + hasDevAccount
        totalHeat  +=1
    }else{
      totalHeat  -=1
    }
    hasDevAccount = hasDevAccount + `\nThey have a total of **${devInfo.user.badge_count.toString()}** badges`
    if (devInfo.user.time_read <= 50){
       totalHeat  +=1
    }else{
      totalHeat  -=1
    }
    hasDevAccount = hasDevAccount + `\nThey have a total read time of **${devInfo.user.time_read.toString()}**`
  }
 
  let premURI = `https://premiumfeatures.roblox.com/v1/users/${user.toString()}/validate-membership`
  const hasPremium = await fetch(premURI).then(response => response.json())
  console.log(hasPremium)
    if (hasPremium == true || hasPremium == "true"){
      totalHeat -=5
    }

  let friendCountURL = `https://friends.roblox.com/v1/users/${user.toString()}/friends/count`
  const friendCount = await fetch(friendCountURL).then(response => response.json())
    if (friendCount.count <= 10) {
      totalHeat +=2
    }
  
  let followingCountURL = `https://friends.roblox.com/v1/users/${user.toString()}/followings/count`
  const followingCount = await fetch(followingCountURL).then(response => response.json())
    if (followingCount.count <= 4) {
      totalHeat +=1
    }

  let followersCountURL = `https://friends.roblox.com/v1/users/${user.toString()}/followers/count`
  const followersCount = await fetch(followersCountURL).then(response => response.json())
    if (followersCount.count <= 30) {
      totalHeat +=1
    }
  let groupCountURL = `https://groups.roblox.com/v1/users/${user.toString()}/groups/roles`
  const groupCount = await fetch(groupCountURL).then(response => response.json())
  var gCount = Object.keys(groupCount.data).length;
   if (gCount <= 5) {
      totalHeat +=1
    }

  const miliseconds = parseInt(playerInfo.age) * 24 * 60 * 60 * 1000;
  const duration = moment.duration(miliseconds).format("Y [years], M [months] & D [days]");

  if (playerInfo.age <= 50) {
      totalHeat +=1
    }else if (playerInfo.age <= 25){
      totalHeat +=3
  }else if (playerInfo.age >= 500){
    totalHeat -=2
  }

 if (totalHeat < 0){
   totalHeat = 0
 }
 if (totalHeat >= maxHeat){
  const altembed = client.defaultEmbed()
    altembed.setTitle(`${client.config.emojis.exclamation} Possible Alt Detected`)
    altembed.setColor("RED")
    altembed.setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
    altembed.setDescription(`**${playerInfo.username} has been flagged by the alt detecting system**, this account scored a **${totalHeat.toString()}/${maxHeat.toString()}** on our test, below are some information that we collected from this account.`)
    altembed.addField("Roblox Username", `[${playerInfo.username}](https://www.roblox.com/users/${user}/profile)`, true)
    altembed.addField("Account Created", `Their account was made ${duration} ago`, false)
    altembed.addField("Devforum", hasDevAccount, false)
    altembed.addField("Friend Count", `They have a total of **${friendCount.count.toString()}** friends`, false)
    altembed.addField("Following Count", `They have a total of **${followingCount.count.toString()}** following`, false)
    altembed.addField("Followers Count", `They have a total of **${followersCount.count.toString()}** follower(s)`, false)
    altembed.addField("Group Count", `They have are in a total of **${gCount.toString()}** group(s)`, false)
    if (hasPremium == true || hasPremium == "true"){
      altembed.addField("Premium", `**User has premium purchased**`, false)
    }
    msg.edit({ embeds:[altembed]})
 }else{
    const altembed = client.defaultEmbed()
    altembed.setTitle(`${client.config.emojis.check} Check Successfull!`)
    altembed.setColor(`#3CB371`)
    altembed.setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
    altembed.setDescription(`${playerInfo.username} scored a **${totalHeat.toString()}/${maxHeat.toString()}** on our test, below are some information that we collected from this account.`)
    altembed.addField("Roblox Username", `[${playerInfo.username}](https://www.roblox.com/users/${user}/profile)`, true)
    altembed.addField("Account Created", `Their account was made ${duration} ago`, false)
    altembed.addField("Devforum", hasDevAccount, false)
    altembed.addField("Friend Count", `They have a total of **${friendCount.count.toString()}** friends`, false)
    altembed.addField("Following Count", `They have a total of **${followingCount.count.toString()}** following`, false)
    altembed.addField("Followers Count", `They have a total of **${followersCount.count.toString()}** follower(s)`, false)
    altembed.addField("Group Count", `They have are in a total of **${gCount.toString()}** group(s)`, false)
    altembed.addField("Link To Profile", `[CLICK HERE](https://www.roblox.com/users/${user}/profile)`, false)
    if (hasPremium == true || hasPremium == "true"){
      altembed.addField("Premium", `[CLICK HERE](https://www.roblox.com/users/${user}/profile)`, false)
    }
    msg.edit({ embeds:[altembed]})
 }
  

 /* if (devInfo.errors){
    totalHeat  +=2
  }else{
      if {devInfo.user.trust_level == 0}(
        totalHeat  +=1
      )

      if {devInfo.user.badge_count <= 3}(
        totalHeat  +=1
      )
  };*/
  
  //console.log(totalHeat)



}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Manually verify's a user.",
    usage: `${filename} <user> <roblox username>`
};
