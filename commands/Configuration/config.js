const { MessageEmbed } = require('discord.js');
const { type } = require('os');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const defaults = client.config.defaultSettings;
    let embedcolor = client.embedColour()
    if(!args[0]){ // Show All Settings.
        const info = new MessageEmbed()
        .setColor(embedcolor)
        .setTitle(`Getting settings for: ${message.guild.name}...`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Please wait while we get the settings for this server!`)
        .setFooter('You want a cookie while you wait?', client.user.avatarURL())
        .setTimestamp()
        const msg = await  message.reply({embeds: [info]})
        const embed = new MessageEmbed()
            .setColor(embedcolor)
            .setTitle(`Current settings for: ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Capitalization is important as these values are cap sensitive.`)
            .setFooter('Statistics updated at', client.user.avatarURL())
            .setTimestamp()
        // Get the catagories
        let loadsettings = message.settings = await client.WestSecure.lookUp(message.guild);
        let settings = Object.values(message.settings)
        const catagories = []
        const catagoryNames = []
        settings.forEach(setting => {
            const catagory = setting.catagory 
            if(catagory == "" || catagory == undefined) return;
            if(setting.editable === false) return "Not editable."
            if(catagoryNames.includes(catagory)) return "Already have that catagory."
            catagories.push({name: catagory, fields: []})
            catagoryNames.push(catagory)
        })
        // Add the keys to the catagories
        catagories.forEach(catagory =>{
            settings.forEach(key =>{
                if(key.disablable == false) return
                if(key.catagory != catagory.name) return
                if(key.value == undefined) key.value = `Value not set.`
                if(key.value == true) key.value = `Enabled.`
                if(key.value == false) key.value = `Disabled.`
                catagory.fields.push(`**${key.name}:**\n\`${key.value}\`\n`)
            })
        })

        // Add the fields
        catagories.forEach(catagory => {
            embed.addField(`${catagory.name}`, catagory.fields.join("\n"), true)
        })

        msg.edit({embeds: [embed]})
    } else{ // Setting a key
        let loadsettings = message.settings = await client.WestSecure.lookUp(message.guild);
        let settings = Object.values(message.settings)
        if (!defaults[args[0]]) return message.reply(client.config.emojis.x+" This key does not exist in the settings");
        
        // find key to see if editable.
        keys = []
        settings.forEach(key =>{
            if(key.name == args[0]) return keys.push(key);
        })
        if(keys[0].editable == false) return message.reply(`${client.config.emojis.x} This key cannot be edited`)
        var joinedValue = args.slice(1).join(" ");
        if(joinedValue == "" || joinedValue == undefined) return message.reply(client.config.emojis.exclamation + "Please provide a value.");

        const objects = [true, false, true, false , true, false]
        const strings = ["true", "false", "enable", "disable" , "enabled", "disabled"]

        if(strings.includes(joinedValue)) joinedValue = objects[strings.indexOf(joinedValue)]
        client.enmap.edit(message, joinedValue, args[0])
        message.reply(`${client.config.emojis.check} ${args[0]} successfully edited to ${joinedValue}`);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    anyUserPermission: ["ADMINISTRATOR"],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Modify a guild's current settings.",
    usage: `${filename} [key] [value]`
};