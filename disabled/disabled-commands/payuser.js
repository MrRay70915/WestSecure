var Discord = require('discord.js')
var rbxbot = require('noblox.js')
exports.run = async (client, message, args, level) => {
  const groupID = Number.parseInt(args[0])
  const robloxname = args[1]
  const robux = Number.parseInt(args[2])
  if(Number.isNaN(groupID))return message.reply("Please provide a valid group ID")
  if(Number.isNaN(robux))return message.reply("Please provide a valid amount of robux to pay")
  if(!groupID) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
  if(!robloxname) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
  if(!robux) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
  const username = await rbxbot.getIdFromUsername(robloxname)
  
  await rbxbot.getIdFromUsername(robloxname)
  .then((robloxid) => {
    rbxbot.groupPayout({ group : groupID , member : robloxid, amount: robux })
    .then(() => {
      message.reply(`Succesfully Paid ${robux} Robux To ${robloxname}`)
    }).catch((err) => {
      message.reply(err.message)
    })
  }).catch((err) => {
    message.reply(err.message)
  })
 
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "WestSecure Administrator",
  disablable: true,
  premium: false
};

exports.help = {
  name: "payuser",
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "Reloads a command that's been modified.",
  usage: "payuser <GroupID> <RobloxName> <Amount>"
};