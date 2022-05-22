const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client({
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
    intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES, 
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ["CHANNEL"]
});

global.ROOT = {}
ROOT.path = __dirname;

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const roblox = require('noblox.js');

const discordToken = process.env.TOKEN

client.settings = {}

client.cooldowns = new Discord.Collection();

client.commands = new Map();
client.events = new Map()

client.aliases = new Map();
client.activeVerifications = new Map()
client.clearToVerify = new Map()

client.config = require('./src/configuration')
client.logger = require('./src/functions/logger')(client)

require("./src/functions/verificationfunctions")(client)
require("./src/api-loader")(client)
require("./src/databaseLoader")(client)
require("./src/functions/functions")(client)
require("./src/functions/server-settings")(client)

const files = require('./src/functions/files.js');
const buttonFiles = files('./src/interactions/buttons');
const selectFiles = files('./src/interactions/selects');
const handlerFiles = files('./src/handlers');



(async () => {
	for (file of handlerFiles) {
		require(file)(client);
	}

	//client.handleDatabase(databaseFiles, config);
//	client.handleEvents(eventFiles);
	client.handleButtons(buttonFiles);
//	client.handleCommands(commandFiles, config);
	client.handleSelects(selectFiles);
})();

const boot = async function(){
    let slashCommands = [];
    const commands = await readdir('./commands/'); // array of commands found in the commands folder of the bot.
    commands.forEach(async f => { // for each of the entries in the command array]
        
        var stats = fs.statSync(`./commands/${f}`); 
        if(stats.isDirectory() == true){
          const catagory = await readdir(`./commands/${f}`);
          catagory.forEach(command => {
          if(!command.endsWith(".js")) return; // if it isnt a js file then it ignores
         
           

           

            /*slashCommands.push({
                name: commandName,
                description: cmd.conf.description,
                options: cmd.conf.slashOptions
            });*/

          const response = client.loadCommand(`${f}/${command}`); // if it is then it tries to load the command with a load command function
            
          if (response){ console.log(response)}else{
            const commandName = command.slice(0,-3)
            const cmd = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
            /*slashCommands.push({
                name: commandName,
                description: cmd.help.description,
                options: cmd.conf.slashOptions
            })*/

          }


          
          })
        }
        if(!f.endsWith(".js")) return; // if it isnt a js file then it ignores
        const response = client.loadCommand(f); // if it is then it tries to load the command with a load command function
        if (response) console.log(response); // then it logs the response it gets
        
    });

    const evtFiles = await readdir("./events/"); // grabs all the event files from the event files directory and puts them in a array
  client.logger.log(`Loading a total of ${evtFiles.length} events.`); // logs number of events found
    evtFiles.forEach(file => { // for each item found in the directory it will run the following on it
        const eventName = file.split(".")[0]; // splits the name
        const response = client.loadEvent(eventName); 
        if (response) console.log(response);
        if(client.events.has(eventName)) client.on(eventName, client.events.get(eventName).bind(null, client));
    });
    client.levelCache = {}; // god i dont want to explain how this works
    for (let i = 0; i < client.config.permissionLevels.length; i++) {
        const thisLevel = client.config.permissionLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    client.login(discordToken).catch(reason => {
        client.logger.warn(`Client was unable to log in: ${reason}`)
    });
}
boot()

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});