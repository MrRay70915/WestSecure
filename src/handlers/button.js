const { Collection } = require('discord.js');

const fs = require('fs');
const { FileArray } = require(`${ROOT.path}/src/functions/FileArray`)



module.exports = (client) => {
	client.handleButtons = async (buttonFiles) => {
    
  	client.buttons = new Collection();
    FileArray(`${ROOT.path}/src/interactions/buttons`, async function(err, res) {
      res.forEach(file => {
         
        if (fs.statSync(file).isDirectory()) return;
       // console.log(file)
        const button = require(file)
        client.buttons.set(button.name, button)
      })
    })
  }
};


/*module.exports = (client) => {
	client.handleButtons = async (buttonFiles) => {
		client.buttons = new Collection();
		for (const file of buttonFiles) {
      
			const button = require(file);
			client.buttons.set(button.name, button);
		}
	};
};*/