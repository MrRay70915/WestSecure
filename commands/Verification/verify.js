const { MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
const alreadyVerifying = new Collection()


exports.run = async (client, message, args, level) => {
  function embedMaker(title, color, description) {
    let embed = new MessageEmbed();
    embed.setColor(color);
    //embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
  }
  if(alreadyVerifying.has(message.author.id)){
      const mes = await message.channel.send({embeds: [embedMaker('Error', "RED", `${client.config.emojis.x} you are already verifying!`)]});;
      setTimeout(() => mes.delete(), 5000)
      return
  }else{
     alreadyVerifying.set(message.author.id, true);
  }
  const editmsg = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation} your request is pending please wait`)]});;

  try {
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username;
    const settings = message.settings = await client.WestSecure.lookUp(message.guild);
    if(settings["verification"].value !== true) editmsg.edit({embeds: [embedMaker('Error', "RED", `${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)]});;
    const possibleKeys = ["alpha", "delta", "bravo", "yellow", "apple", "banana", "verify", "west", "secure"]
    const status = client.shuffle(possibleKeys).join(" ")
    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
    if(verifiedRole == undefined) return editmsg.edit({embeds: [embedMaker('Error', "RED", `${client.config.emojis.exclamation} This guild's configuration hasn't been properly set up. please set a valid verified role.`)]});;
    
    const groupID = settings.groupID.value
    const setnick = settings.setnick.value
    const groupJoin = settings.GroupJoinRequired.value
    const logs = client.getChannel(message.guild, message.settings.logs.value);
    const alreadyInDB = await client.database.verify.count(message.author.id) >= 1
    let extraDetails = ``

    if(alreadyInDB === true){
      if(client.hasRole(message.member, message.settings.verifiedRole.value) == true){
        const rawdata = await client.database.verify.read(message.author.id);
        const data = rawdata[1]
        const thumb = (await noblox.getPlayerThumbnail([data.RobloxID], 720, "png", false))[0].imageUrl
        const embed = new MessageEmbed()
        .setColor("RED")
        .setThumbnail(thumb)
        .setTitle(`${client.config.emojis.x} Already Verified as \`${data.RobloxUsername}\``)
        .setDescription(`If you want to verify as another account run \`;unlink\`.\nOr if you want to fix your roles / nick run \`;update\`(Temporarly Disabled).`)
        try{
          editmsg.delete()
        }catch{}
        if(alreadyVerifying.has(message.author.id)){
          alreadyVerifying.delete(message.author.id)
        }
        message.channel.send({content:`<@${message.author.id}>`, embeds:[embed]})
      }else{
        return verifiedNeedRoles() 
      } 
    }else{ 
        try{
          const IDS = await checkAPI(message.author.id)
          if(IDS.length == 0) return statusVerification();
          const username = await noblox.getUsernameFromId(IDS[0])
          const avatar = await client.apis.roblox.avatarURL(IDS[0])
          await editmsg.delete();
          const wouldYouLikeToVerifyAsX = new MessageEmbed()
         
          .setFooter(clientUsername, avatarURL)
          .setTimestamp()
          .setThumbnail(avatar)
          .setColor(client.embedColour("safe")) 
          .setFooter("This prompt will automatically cancel in 20 seconds") 
          .setTitle(`${client.config.emojis.exclamation} Possible account found in api!`)
          .setDescription(`Would you like to verify as \`${username}\`. (respond with \`yes\` or \`no\`)`)
          const wouldu = await message.channel.send({content:`<@${message.author.id}>` ,embeds: [wouldYouLikeToVerifyAsX]})
          const agree = ["yes", "y", "obama",]
          const filter = m => m.content.toLowerCase().includes("yes") || m.content.toLowerCase().includes("no") && m.author.id == message.author.id ;
          const collector = message.channel.createMessageCollector({ filter, time: 20000 });
         
          collector.on('collect', async (m) => {
            collector.stop()
            if (m.content.toLowerCase().includes("yes") ){
              if(groupJoin == true){
                //let isIn = await isInGroup(IDS[0]
                if(await isInGroup(IDS[0]) == true){return verify(IDS[0], username, avatar, "API Verification", wouldu)};
                
                const groupEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`${client.config.emojis.x} You aren't in the group!`)
                .setDescription(`The roblox user: \`${username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                return wouldu.edit({embeds: [groupEmbed]})
              }else{
                extraDetails = `${extraDetails}\nVerified By API`
                verify(IDS[0], username, avatar, "API Verification", wouldu);
              }
            }else if(m.content.toLowerCase().includes("no")){
              try{
                 wouldu.delete()
              }catch{}
              return chooseMethod(IDS[0], username, avatar);
            }
           
          });

          collector.on('end', collected => {
            if (collected.size == 0 ){
              try{
                 wouldu.delete()
              }catch{}
              if(alreadyVerifying.has(message.author.id)){
                alreadyVerifying.delete(message.author.id)
              }
              return message.channel.send({embeds: [embedMaker('', "RED", `Your verification prompt has been automatically cancelled, please run \`;verify\` again! `)]});;
            }
           
          });
        }catch(err){
           return message.channel.send({embeds: [embedMaker('Unexpected error', "RED", `An unexpected error has occured here are the details: ${err.message}`)]});;
        }
    }
    
    async function checkAPI(discordID){
      const ids = []
      const rover = await client.apis.rover(discordID);
      const bloxlink = await client.apis.bloxlink(discordID);
      if(rover !== false) ids.push(rover.id);
      if(bloxlink !== false) ids.push(bloxlink.id);
      return ids
    }
    async function statusVerification(){
      const welcome = new MessageEmbed()
      .setAuthor(clientUsername, avatarURL)
      .setFooter(clientUsername, avatarURL)
      .setTimestamp()
      .setColor(client.embedColour("safe")) 
      .setThumbnail(message.guild.iconURL())
      .setTitle(`${client.config.emojis.check} Welcome \`${message.author.username}\` to **${message.guild.name}**!`)
      .setDescription(`Welcome to ${message.guild.name}. In order to verify yourself please respond with your Roblox username`)
      .setFooter("This prompt will automatically cancel in 20 seconds") 
      try {
        if(alreadyVerifying.has(message.author.id)){
          alreadyVerifying.delete(message.author.id)
        }
        editmsg.delete()
      } catch (error) {console.log(error)}
      const sendrobloxName = await message.channel.send({content:`<@${message.author.id}>` ,embeds: [welcome]})
      const filter = m => m.author.id == message.author.id ;
      const collector = message.channel.createMessageCollector({ filter, time: 20000 });

       collector.on('collect', async (m) => {
          collector.stop()
          try{
            sendrobloxName.delete()
          }catch{}
          
          const pendingMSG = await message.channel.send({embeds: [embedMaker('Pending Request', "#FFA500", `${client.config.emojis.exclamation} your request is pending please wait`)]});;
          const raw = m.content;
          try {
            const test = await noblox.getIdFromUsername(raw);
          }catch(error){
            if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            const errorEmbed = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor("RED") 
            .setTitle(`${client.config.emojis.x} An Error has occurred!`)
            .setDescription(`${error.name}: ${error.message}`)
             try {
             if(alreadyVerifying.has(message.author.id)){
                alreadyVerifying.delete(message.author.id)
              }
              pendingMSG.delete()
            } catch (error) {}
            return message.channel.send({embeds:[errorEmbed]})
          }
          const ID = await noblox.getIdFromUsername(raw);
          const Username = await noblox.getUsernameFromId(ID);
          const avatar = await client.apis.roblox.avatarURL(ID)
          if(!client.activeVerifications.has(ID.toString())){
            client.activeVerifications.set(ID.toString(), {robloxID: ID.toString(), user: message.author})
          }
          try {
           if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            pendingMSG.delete()
          } catch (error) {}
          if(groupJoin == true){
            if(await isInGroup(ID) == true) return chooseMethod(ID, Username, avatar);
            const groupEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`${client.config.emojis.x} You aren't in the group!`)
            .setDescription(`The roblox user: \`${Username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            return message.channel.send({embeds: [groupEmbed]})
          }else{
            return chooseMethod(ID, Username, avatar);
          }
          
      })
      collector.on('end', collected => {
        if (collected.size == 0 ){
          try{wouldu.delete()}catch{} 
          if(alreadyVerifying.has(message.author.id)){
            alreadyVerifying.delete(message.author.id)
          }
          return message.channel.send({embeds: [embedMaker('', "RED", `Your verification prompt has been automatically cancelled, 20 seconds passed. Please run \`;verify\` again! `)]});;
        }
      });
      
    }

    async function chooseMethod(ID, Username, avatar){
      const embed = client.defaultEmbed()
      .setColor("#5865F2")
      .setTitle(`Step 2. Pick a method of verification.`)
      .setDescription(`**Please pick a method of verification.**\n We currently have 4 options for verification, we give alot of flexibilty when it comes to verifying to make sure you can select the one you are comfortable with!`)
      .addField("‣ Game Verification:", "You can join a game, enter a code and you will be verified")
      .addField("‣ Description Verification:", "Add certain words to your status/description to get verified")
      .addField("‣ ROVER Verification:", "You can also verify yourself by using ROVER")
      .addField("‣ BLOXLINK Verification:", "You can also verify yourself by using BLOXLINK")
      .setFooter("This prompt will automatically cancel in 20 seconds") 
      const gameButton = new MessageButton();
      gameButton.setStyle('PRIMARY');
      gameButton.setLabel('Game Verification');
      gameButton.setCustomId('verifyingame');

      const descButton = new MessageButton();
      descButton.setStyle('PRIMARY');
      descButton.setLabel('Description Verification');
      descButton.setCustomId('descverification');

      const roverButton = new MessageButton();
      roverButton.setStyle('PRIMARY');
      roverButton.setLabel('ROVER Verification');
      roverButton.setCustomId('roververification');

      const bloxlinkButton = new MessageButton();
      bloxlinkButton.setStyle('PRIMARY');
      bloxlinkButton.setLabel('BLOXLINK Verification');
      bloxlinkButton.setCustomId('bloxlinkverification');

      const row = new MessageActionRow()
      row.addComponents(gameButton);
      row.addComponents(descButton);
      row.addComponents(roverButton);
      row.addComponents(bloxlinkButton);

      const btnMsg = await message.channel.send({ embeds: [embed], components: [row] });

      const collector = btnMsg.createMessageComponentCollector({ componentType: 'BUTTON', time: 20000 });
      

      collector.on('collect', i => {
        collector.stop()
        if (i.user.id === message.author.id) {
          if(i.customId == "verifyingame"){
            gameVerification(ID, Username, avatar)
            try{
              btnMsg.delete()
            }catch{}
            return 
          }else if (i.customId == "descverification"){
            setYourStatus(ID, Username, avatar)
             try{
              btnMsg.delete()
            }catch{}
            return 
          }else if (i.customId == "roververification"){
             try{
              btnMsg.delete()
            }catch{}
            if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            message.channel.send({content:`<@${message.author.id}>` ,embeds:[embedMaker('Rover Verification', "#5A67D8", `please head over to the rover website or [CLICK HERE](https://verify.eryn.io) and follow the steps once youre finished run \`;verify\` again! `)]})
            
          }else if (i.customId == "bloxlinkverification"){
             try{
              btnMsg.delete()
            }catch{}
            if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            message.channel.send({content:`<@${message.author.id}>` ,embeds:[embedMaker('Rover Verification', "#5A67D8", `please head over to the bloxlink website or [CLICK HERE](https://blox.link/verify) and follow the steps once youre finished run \`;verify\` again! `)]})
          }


        }
      });
      collector.on('end', collected => {
        if(collected.size == 0){
          return btnMsg.edit({embeds: [embedMaker('', "RED", `Your verification prompt has been automatically cancelled, 20 seconds passed. Please run \`;verify\` again! `)], components: []});;
        }
      });

     }

     async function setYourStatus(ID, Username, avatar){
        const setStatusEmbed = new MessageEmbed()
        .setFooter("This prompt will automatically cancel in 2 minutes") 
        .setTimestamp()
        .setColor(client.embedColour("safe"))
        .setThumbnail(avatar)
        .setTitle(`Step 3: Modify your About section of your profile`)
        .setDescription(`In order to prove you own this account, please either set or set the last line of your [**description / about**](https://www.roblox.com/users/${ID}/profile) to\n\`${status}\`\nand then reply with \`done\` once you have done so.\n [Example](https://prnt.sc/21svfo1)`)
        
        /*const waitForResponse = await client.awaitReply(message, setStatusEmbed, 300000);
        if(waitForResponse){
          return checkDescriptionIfCorrect(ID, Username, avatar)
        }*/
        const statusmessage = await message.channel.send({embeds: [setStatusEmbed]})
        const filter = m => m.content.toLowerCase().includes("done") || m.content.toLowerCase().includes("yes") && m.author.id == message.author.id ;
        const collector = message.channel.createMessageCollector({ filter, time: 120000 });
        collector.on('collect', async (m) => {
          collector.stop()
          //return checkDescriptionIfCorrect(ID, Username, avatar)
          const blurb = await noblox.getBlurb({userId: ID})
          const splitBlurb = blurb.split("\n")
          const lastLine = splitBlurb[splitBlurb.length - 1]
          if(lastLine == status){
            // return verify(ID, Username, avatar, "Standard Verification")
            return verify(ID, Username, avatar, "Standard Verification", statusmessage)
          }else {
            if(client.activeVerifications.has(ID.toString())){
              client.activeVerifications.delete(ID.toString())
            }
            if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            const invalidStatus = new MessageEmbed()
            .setTimestamp()
            .setColor("RED")
            .setTitle(`${client.config.emojis.x} Error`)
            .setDescription(`The last line did not match, Expected: \`${status}\`\n Got: \`${lastLine}\`\n**If it was tagged please try again.**`)
            return statusmessage.edit({embeds: [invalidStatus]});
            }
        });
        collector.on('end', collected => {
          if (collected.size == 0 ){
            try{wouldu.delete()}catch{} 
            if(alreadyVerifying.has(message.author.id)){
              alreadyVerifying.delete(message.author.id)
            }
            return statusmessage.edit({embeds: [embedMaker('', "RED", `Your verification prompt has been automatically cancelled, 20 seconds passed. Please run \`;verify\` again! `)]});;
          }
        });
      }

      async function verify(id, username, thumbURL, method, msg){
        
        if(client.activeVerifications.has(id.toString())){
            client.activeVerifications.delete(id.toString())
        }
        if(alreadyVerifying.has(message.author.id)){
          alreadyVerifying.delete(message.author.id)
        }
        if(extraDetails == ``) extraDetails = `\`None\``
        else extraDetails = `\n\`\`\`\n${extraDetails}\n\`\`\``
        const embed = new MessageEmbed()
        .setTimestamp()
        .setColor(`#3CB371`)
        .setTitle(`${client.config.emojis.check} Successfully Verified`)
        //.setDescription(`\`${message.author.tag}\` has verified as \`${username}\`\nExtra Details: ${extraDetails}`)
        .setDescription(`You have been successfully as **${username}** if you'd like to update your roles you can always run \`;update\``)
        .setThumbnail(thumbURL)
           // client.database.verify.event(message.author.tag, username, id, method, extraDetails, message.guild.name)
        addRoles(username)
        //findRolesinGuild(id)
        client.verification.bindRoles(message.member, id)
        await client.database.verify.write(username, id, message.author.id) 
        //if(logs !== undefined) logs.send(embed)
        try{
          msg.delete()
        }catch{}
        message.channel.send({content:`<@${message.author.id}>` ,embeds: [embed]})
      }
      async function addRoles(username){
        if(alreadyVerifying.has(message.author.id)){
          alreadyVerifying.delete(message.author.id)
        }
        let name = username
        try {
          await message.member.roles.add(verifiedRole);
        } catch (error) {
          extraDetails = `${extraDetails}\nCRITICAL ERROR. Failed to add verified Roles for user. (${error.name} : ${error.message})`
        }
        try {
          if(unverifiedRole !== undefined || message.member.roles.get(unverifiedRole.id)) await message.member.roles.remove(unverifiedRole);
        } catch (error) {    
                // Probably didn't have the role
            }
        try {
          if(setnick == true) {
            if(message.author.id !== message.guild.ownerID);{
                await message.member.setNickname(name)
            }
          }
        } catch (error) {
          `${extraDetails}\nFailed to set nickname. (${error.name} : ${error.message})`
        }   
      }
     

    async function verifiedNeedRoles(){ // Needs roles
      const rawdata = await client.database.verify.read(message.author.id);
      const data = rawdata[1]
      if(groupJoin == true) {
        if(groupID == undefined || client.isNum(groupID) == false) {editmsg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
        const groupRank = await noblox.getRankInGroup(groupID, data.RobloxID)
          if(groupRank == 0){
            const groupEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`${client.config.emojis.x} You aren't in the group!`)
            .setDescription(`The roblox user: \`${data.RobloxUsername}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            return editmsg.edit({embeds: [groupEmbed]})
          }
      }
      extraDetails = `${extraDetails}\nRecord Found in West DB` 
      message.member.roles.add(verifiedRole);
      findRolesinGuild(data.RobloxID)
      client.verification.bindRoles(message.member, data.RobloxID)
      const updatedName = data.RobloxUsername
      addRoles(updatedName)
      const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${data.RobloxID}`)
      const thumbURL = thumbnailRaw.data[0].imageUrl
      if(extraDetails == ``) extraDetails = `\`None\``
      else extraDetails = `\n\`\`\`\n${extraDetails}\n\`\`\``
      const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(`#3CB371`)
      .setTitle(`${client.config.emojis.check} Successfully Verified`)
        //.setDescription(`\`${message.author.tag}\` has verified as \`${username}\`\nExtra Details: ${extraDetails}`)
      .setDescription(`You have been successfully as **${updatedName}** if you'd like to update your roles you can always run \`;update\``)
      .setThumbnail(thumbURL)
     
      editmsg.edit({embeds: [embed]})
      
    }

    async function isInGroup(id){
      if(groupID == undefined || client.isNum(groupID) == false) {msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
      const groupRank = await noblox.getRankInGroup(groupID, id)
       return groupRank !== 0
    }

    async function findRolesinGuild(robloxID){
      try {
      if(message.settings.findRoles.value == true){
        extraDetails = `${extraDetails}\nFind Roles Enabled. Adding Roles.`
        const groupID = message.settings.groupID.value
        if(groupID == undefined) return;
          const rank = await noblox.getRankNameInGroup(groupID, robloxID);
          if(rank == "Guest") return;
            message.guild.roles.cache.forEach(role => {
            if(role.name.toLowerCase() == rank.toLowerCase()){
              extraDetails = `${extraDetails}\nAdded ${role.name} because it matched their group rank.`
              message.member.roles.add(role);
            }
          })
        }
      } catch (error) {
          if(alreadyVerifying.has(message.author.id)){
            alreadyVerifying.delete(message.author.id)
          }
          console.log(`\`\`\`js\n${error}\`\`\``)
        }
    }
  
    
  }catch(err){
    if(alreadyVerifying.has(message.author.id)){
      alreadyVerifying.delete(message.author.id)
    }
    return editmsg.edit({embeds: [embedMaker("Error", "RED", `There was an error while attempting to verify you \n${err}`)]});
  }

  
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["getroles"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Verify your self ",
    usage: `${filename}`
};