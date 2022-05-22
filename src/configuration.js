//onst keys = require("./keys.json");
const config = {

    "AuthorizedUsers": [
        "212081114095943690",
        "570320433157505033",
      "595721141663039528",
      "354359390893113344"
       

        
    ],
    "SupportUsers": [
        "412729903893708801" // Harry
    ],
    "bootMessage": `Booting...`,

    "emojis": {
        check: "<:approved:911070453366403083>",
        exclamation: "<:error:914646977076142091>",
        ["!"]: "<:error:914646977076142091>",
        x: "<:denied:911070453701967892>",

    },
    "prefix": ";",
    "database": ["mongodb+srv://rayray:billen09@cluster0.qiwkm.mongodb.net", "WestSecure"],
    //"token": keys.main,
    "status": "static", // static or dev

    "logChannel": "",
    "errorChannel": "",
    "defaultGroup": "10437420",
    "defaultSettings" : {
        // ohmygod i miss spelled category aaaaaaaaaaaa

        // General Settings

        "autorole": {
            name: "autorole",
            value: false,
            catagory: "General",
            editable: true
        },        

        "prefix": {
            name: "prefix",
            value: ";",
            catagory: "General",
            editable: true
        },

        "welcoming": {
            name: "welcoming",
            value: false,
            catagory: "General",
            editable: true
        },
        "welcoming-channel": {
            name: "welcoming-channel",
            value: undefined,
            catagory: "General",
            editable: true
        },
        "welcoming-text": {
            name: "welcoming-text",
            value: `Welcome {{user}} to {{guild}}!`,
            catagory: "General",
            editable: true
        },
        //

        "adminrole": {
            name: "adminrole",
            catagory: "Moderation", 
            value: undefined, 
            editable: true,
        },
        "modrole": {
            name: "modrole",
            catagory: "Moderation", 
            value :undefined, 
            editable: true,
        },
        "mutedrole": {
            name: "mutedrole",
            catagory: "Moderation",
            value: undefined, 
            editable: true,
        },
        "logs": {
            name: "logs",
            catagory: "Moderation", 
            value: undefined, 
            editable: true
        },

        // Verification Keys
        "findRoles": {
            name: "findRoles",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
        "binds": {
            name: "binds",
            value: [], 
            editable: false
        },
        "verification": {
            name: "verification",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
        "groupID": {
            name: "groupID",
            catagory: "Verification", 
            value: undefined, 
            editable: true
        },
        "setnick": {
            name: "setnick",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
        "unverifiedRole": {
            name: "unverifiedRole",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
        "verifiedRole": {
            name: "verifiedRole",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
        "GroupJoinRequired": {
            name: "GroupJoinRequired",
            catagory: "Verification", 
            value: false, 
            editable: true
        },
     
        "premium": {
            name: "premium",
            value: false, 
            editable: false
        },
        "disabled-commands": {
            name: "disabled-commands", 
            value: [], 
            editable: false
        },
        
      
        "allowedRegister": {
            name: "allowedRegister", 
            value: false, 
            editable: false
        },
        
    },

    permissionLevels: [
        {
            level: 0,
            name: "User", 
            check: () => true
        },
        {
            level: 1,
            name: "Moderator",
            check: (message) => {
                try {
                    try {
                        let adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modrole.value.toLowerCase());
                        if(adminRole == undefined) adminRole = message.guild.roles.cache.find(r => r.id === message.settings.modrole.value.replace("<@&", "").replace(">", ""));
                        return (adminRole && message.member.roles.cache.has(adminRole.id));
                      } catch (e) {
                        return false;
                      }
                  } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 2,
            name: "Administrator",
            check: (message) => {
                try {
                    try {
                        let adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminrole.value.toLowerCase());
                        if(adminRole == undefined) adminRole = message.guild.roles.cache.find(r => r.id === message.settings.adminrole.value.replace("<@&", ""));
                        return (adminRole && message.member.roles.cache.has(adminRole.id));
                      } catch (e) {
                        return false;
                      }
                  } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 3,
            name: "Server Owner",
            check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
        },
        {
            level: 8,
            name: "WestSecure Support",
            check: (message) => config.SupportUsers.includes(message.author.id)
        },
        {
            level: 10,
            name: "WestSecure Administrator",
            check: (message) => config.AuthorizedUsers.includes(message.author.id)
        }
    ]
}
module.exports = config;
