const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")


exports.run = async (client, message, args, level) => {
  const connections = {
    Discord: "pending",
    Server: "pending",
    API: "pending"
  }
  const pending = client.defaultEmbed()
    .setTitle(`🏓 Pong!`)
    .setDescription(`${message["!"]} Bot Connection To Discord: \`${connections.Discord}\`\n${message["!"]} Bot Connection to API:: \`${connections.Server}\`\n${message["!"]} API Latency: \`${connections.API}\``)
  const msg = await message.channel.send({embeds: [pending]});
  
  connections.API = `${Math.round(client.ws.ping)}ms.`
  connections.Discord = `${msg.createdTimestamp - message.createdTimestamp}ms.`
  try{
    const curTime = new Date()
    const data = client.apis.https.get("https://WestSecureV2.mrray70915.repl.co")
  
    data.catch(()=> {connections.Server = false})
    data.then(()=> {connections.Server = `${new Date() - curTime} ms.`})
  } catch(err) {
    connections.Server = false
  }
  const finish = client.defaultEmbed()
    .setTitle(`🏓 Pong!`)
    .setDescription(connections.Server == false ? `${message["check"]} Bot Connection To Discord: \`${connections.Discord}\`\n${message["x"]} Bot Connection to API v2.0: \`Offline.\`\n${message["check"]} Bot API Latency: \`${connections.API}\`` : `${message["check"]} WestSecure Connection To Discord: \`${connections.Discord}\`\n${message["check"]} WestSecure Connection to API v2.0: \`${connections.Server}\`\n${message["check"]} Bot API Latency: \`${connections.API}\``)
  msg.edit({embeds: [finish]});
};
    
  exports.conf = {
    cooldown: 10,
    description: "Get bot latency and API latency",
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: false,
    slashOptions: []
  };
    
  exports.help = {
    name: "ping",
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Check's the latency of the bot.",
    usage: "ping"
  };
