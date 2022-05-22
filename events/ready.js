const timeout = new Map()
const { MessageEmbed, Collection, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const noblox = require('noblox.js');
const RBX = require("@mfd/rbxdatastoreservice")

async function startApp () {
    // You MUST call setCookie() before using any authenticated methods [marked by 🔐]
    // Replace the parameter in setCookie() with your .ROBLOSECURITY cookie.
    
    const currentUser = await noblox.setCookie(process.env['ROBLOXCOOKIE'])
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)

    // Do everything else, calling functions and the like.
    const groupInfo = await noblox.getGroup(9997719)
    console.log(groupInfo)
}



module.exports = async (client, message) => {

  
const mainToken = process.env.MAIN_TOKEN
  
  async function startData () {
    await RBX.InitializeAsync(mainToken, 8185222973)
    // Do everything else, calling functions and the like.
   
    //console.log(value.Data);
    
  }

  try{
    startData()
  }catch(err){
    console.log(err)
  }

  try{
    const currentUser = await noblox.setCookie(process.env.ROBLOX_COOKIE)
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
  
  }catch (error) {
   console.log(error.message)
  }












client.channels.fetch("912112388365496382").then((c) => {
  const filter = m => m.author.id != "570320433157505033" //m.author.id != "212081114095943690" || m.author.id != "570320433157505033"
  const collector = c.createMessageCollector({ filter});
  collector.on('collect', async (m) => {
	 
    const thread = await m.startThread({
      name: `bug-report-${m.author.id.toString()}`,
      autoArchiveDuration: 'MAX',
      reason: 'Please dicuss futher reports in here',
    });

    const sendembed = new MessageEmbed()
    sendembed.setAuthor(m.author.tag, m.author.displayAvatarURL());
    sendembed.setTimestamp()
    sendembed.setColor(`#3CB371`)
   // sendembed.setTitle(`Bug Report`)
    sendembed.setDescription(`Please provide screenshots, gif or video of your incident, or please screenshot your F9 screen scrolled all the way down. You could also explain what you're experiencing in more detail here`)
    const row = new MessageActionRow()

    const closeButton = new MessageButton();
    closeButton.setStyle('DANGER');
    closeButton.setLabel('Close Thread');
    closeButton.setCustomId(`closeThread-${m.author.id.toString()}`);
    row.addComponents(closeButton);

    //thread.send({content:`<@${m.author.id}>`, embeds: [sendembed], components: [row] })
    thread.send({content:`<@${m.author.id}>`, embeds: [sendembed] })
  });

  


});


client.channels.fetch("917193973251063808").then((c) => {
  const filter = m => m.author.id != "212081114095943690" || m.author.id != "570320433157505033"
  const collector = c.createMessageCollector({ filter});
  collector.on('collect', async (m) => {
	  
    const thread = await m.startThread({
      name: `suggestion-${m.author.id.toString()}`,
      autoArchiveDuration: 'MAX',
      reason: 'Please dicuss futher reports in here',
    });

    const sendembed = new MessageEmbed()
    sendembed.setAuthor(m.author.tag, m.author.displayAvatarURL());
    sendembed.setTimestamp()
    sendembed.setColor(`#3CB371`)
   // sendembed.setTitle(`Bug Report`)
    sendembed.setDescription(`please use this thread to futher discuss the suggestion, in order to prevent flooding the main channel!`)
    const row = new MessageActionRow()

    const closeButton = new MessageButton();
    closeButton.setStyle('DANGER');
    closeButton.setLabel('Close Thread');
    closeButton.setCustomId(`closeThread-${m.author.id.toString()}`);
    row.addComponents(closeButton);

    //thread.send({content:`<@${m.author.id}>`, embeds: [sendembed], components: [row] })
    thread.send({embeds: [sendembed] })
  });

  


});


};