const Discord = require("discord.js");
const filename = require('path').basename(__filename).split(".")[0]
const https = require('https');
const noblox = require("noblox.js")
const cooldowns = new Discord.Collection();
exports.run = async (client, message, args, level) => {
  let teamname = args[0]
  let givenName = args[1].join(" ")
  if (!teamname || !givenName){
    return
  }
  givenName = givenName.toLowerCase()
  teamname = teamname.toLowerCase()

  let threadName = `${teamname} ${givenName}`
  let channelName = `${teamname}-logs`

  let channel = client.channels.cache.find(c => c.name === channelName)  
  try{
    let thread = channel.threads.cache.find(x => x.name === threadName);
    console.log(thread)
  }catch(er){
    console.log(er.message)
  }

}


  
  
  



exports.conf = {
    cooldown: 5,
    enabled: true,
    guildOnly: false,
    aliases: ["ginfo"],
    permLevel: "User",
    disablable: false,
    premium: false,
    slashOptions: []
  };
    
  exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "get information of the selected groupID",
    usage: `${filename} <groupId>`
  };
