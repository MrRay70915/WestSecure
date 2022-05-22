const { Collection } = require('discord.js');

const fs = require('fs');
const { FileArray } = require(`${ROOT.path}/src/functions/FileArray`)


module.exports = (client) => {
	client.handleSelects = async (buttonFiles) => {
    
  	client.selects = new Collection();
    FileArray(`${ROOT.path}/src/interactions/selects`, async function(err, res) {
      res.forEach(file => {
         
        if (fs.statSync(file).isDirectory()) return;
       // console.log(file)
       	const select = require(file);
		  	client.selects.set(select.name, select);
      })
    })
  }
};



/*module.exports = (client) => {
	client.handleSelects = async (selectFiles) => {
		client.selects = new Collection();

		for (const file of selectFiles) {
			const select = require(file);
			client.selects.set(select.name, select);
		}
	};
};*/