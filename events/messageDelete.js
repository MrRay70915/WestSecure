const timeout = new Map()
const { MessageEmbed, Collection, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const roblox = require('noblox.js');
let amountdeleted = 0



module.exports = async (client, message) => {
    if (message.author.bot) return;
    let channel = message.channel
    
    /*if (channel.id == "912112388201938963" || channel.id == "928034858570231908"  ){
      if (message.author.id == "242094693217730561" || message.author.id == "212081114095943690") {
        const sendembed = new MessageEmbed()
        sendembed.setTitle("Message Deleted")
        sendembed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        sendembed.setTimestamp()
        sendembed.setColor(`RED`)
      // sendembed.setTitle(`Bug Report`)
        sendembed.setDescription(`${message.content}`)
        channel.send({ embeds: [sendembed] })
      }

    }*/

    
};