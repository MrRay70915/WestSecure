
const { version, MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
const os = require("os")
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
  let ssudetails = args[0]

  if (!ssudetails){
    return
  }

  ssudetails =  args.join(' ')
  let ssuEmbed = new MessageEmbed()
    .setColor("#18A558")
    .setTitle(`Server Startup`)
    .setDescription(`**<t:${ssudetails}>[<t:${ssudetails}:R>]** we will be trying to host a SSU. Please vote below if you can or cannot make it and based on the votes we can decide`)
    //.setTimestamp()
   .setFooter(`Hosted By: ${message.author.username}`, client.user.avatarURL())

  let moreDetails = new MessageEmbed()
  .setColor("RED")
  .setTitle(`Important Information`)
  .setDescription(`${client.config.emojis.exclamation} You need a license in order to legally drive a vehicle, you can aquire one by doing a 5-10 minute driving exam in a game that will be linked below. **you only have to do this once and never again.** Once you are done you can join the SSU and head over to the DMV and you will receive your license`)

  const gameButton = new MessageButton();
  gameButton.setStyle('LINK');
  gameButton.setLabel('Driving Exam');
 // gameButton.setCustomId('driving_exam');
  gameButton.setEmoji("🎮")
  gameButton.setURL("https://www.roblox.com/games/8157841871/Stanton-County-Driver-Exam")
  const row = new MessageActionRow()
  row.addComponents(gameButton);

  const sendMsg = await message.channel.send({content:"@everyone SSU Annoucement!" ,embeds: [ssuEmbed, moreDetails], components: [row] });
  sendMsg.react('✅');
  sendMsg.react('❌');
  try{
    message.delete()
  }catch{}

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "WestSecure Administrator",
  disablable: false,
  premium: false
};

exports.help = {
  name: "ssu",
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "send a server startup message in the SSU channel",
  usage: "ssu <message>"
};
