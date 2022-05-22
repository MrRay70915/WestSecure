module.exports = (client, app) => {
    return app.get("/api/roblox/:robloxID", async (req, res) =>{
        const id = req.params.robloxID
        let alreadyInDB = await client.database.verify.getDiscordId(id)
        let stringify = JSON.stringify(alreadyInDB)
        const replaced = stringify.replace('[', '');
        const replaced2 = replaced.replace(']', '');
        const replaced3 = replaced2.replace('"', '');
        const replaced4 = replaced3.replace('"', '');
        const boolval = replaced4.split(",")[0]
        if (boolval == "true"){
          const discordid = replaced4.split(",")[1]
          return res.json({status: "ok", code: "200",discordId: discordid })
        }else{
          return res.json({"error": true,"errormessage": "User is not in the server or not verified!"})
        }
        
        
    })
}