const { MessageEmbed } = require("discord.js");
const noblox = require("noblox")
module.exports = async (client, member) => {
   /* const settings = await client.getSettings(member.guild);
    if(settings.welcoming.value == true){
        const welcomingChannel = client.getChannel(member.guild, settings["welcoming-channel"].value);
        if(welcomingChannel !== undefined){
            const welcomeMessage = customText(settings["welcoming-text"].value)
            if(welcomeMessage == "--embed"){
                let desciption
                if(settings.GroupJoinRequired.value == true) desciption = `
                In order to gain access to the rest of the channels please follow these steps.\n
                **Step 1:** Read the rules,
                **Step 2:** Join our group linked [here,](https://www.roblox.com/groups/${settings.groupID.value})
                **Step 3:** Run \`${settings.prefix.value}verify\`
                **Step 4:** boom you're in
                `
                else desciption = `
                In order to gain access to the rest of the channels please follow these steps.\n
                **Step 1:** Read the rules,
                **Step 2:** Run \`${settings.prefix.value}verify\`
                **Step 3:** boom you're in
                `
                const embed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setTimestamp()
                    .setColor(client.embedColour())
                    .setThumbnail(member.guild.iconURL())
                    .setTitle(`Welcome \`${member.user.username}\` to **${member.guild.name}!**`)
                    .setDescription(desciption)
                setTimeout(function(){welcomingChannel.send({embeds: [embed]})}, 1000)
            }
            else setTimeout(function(){welcomingChannel.send(welcomeMessage)}, 1000)
        }
    }
    if(settings.unverifiedRole.value !== undefined || settings.unverifiedRole.value !== false){
        const role = await client.getRole(member.guild, settings.unverifiedRole.value);
        if(role !== undefined) await member.roles.add(role)
    }
    const alreadyInDB = await client.database.verify.count(member.user.id) >= 1
    const data = await checkAPI(member.user.id)
    const user = member.user.id
    const userObj = client.users.cache.get(user)
    if(alreadyInDB === false){
      if(data.length == 0) console.log(`${userObj.tag} was not found.`);
      if(data.length == 1) {
        console.log(`${userObj.tag} was found as ${data[0]}.`)
        verify(user, data[0])
      }
      if(settings.autorole.value !== false) {
          const role = await client.getRole(member.guild, settings.autorole.value);
          if(role !== undefined) await member.roles.add(role)
      }
      function customText(text){
          text = text.toString()
          return text.replace("{{user}}", `${member.user}`).replace(`{{guild}}`, member.guild.name)
      }
    }else{
      const rawdata = await client.database.verify.read(member.user.id);
      const data = rawdata[1]
      
    }

    async function checkAPI(discordID){
        discordID = discordID.toString()
        const ids = []

        const rover = await client.apis.rover(discordID);
        const bloxlink = await client.apis.bloxlink(discordID);
        if(rover.id !== undefined) ids.push(rover.id);
        if(bloxlink.id !== undefined) ids.push(bloxlink.id);
        return ids
    }

    async function verify(disID, rblxID){
        const user = client.users.cache.get(disID)
        const robloxUsername = await noblox.getUsernameFromId(rblxID)
        client.database.verify.event(user.tag, robloxUsername, rblxID, "API Verification", "API Verification", "API Verification")
        client.database.verify.write(robloxUsername, rblxID, disID)
    }*/
};