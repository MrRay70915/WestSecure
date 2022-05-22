const objectToTable = require("object-to-table")

async function checkDatabase(client, id, res) {
  let alreadyInDB = await client.database.verify.count(id) >= 1
  if(alreadyInDB === true){
    return true
  }else{
    return false
  }
}

module.exports = async(client, app) => {
    return app.get("/api/roles/:guild/:user", (req, res) => {
    const list = []
    const id = req.params.user
    let guild = req.params.guild
    if (!guild) return res.json({"error": true, "errormessage": "guild has not been supplied"}) 
    if (!id) return res.json({"error": true, "errormessage": "userId has not been supplied"}) 
    let test = client.guilds.cache.get(guild.toString())
    if (!test){return res.json({"error": true,"errormessage": "Specified server has not been found, please check the server ID or I haven't join that server!"})}
    client.guilds.cache.get(guild.toString()).members.fetch(id).then(async(member) => {
          let alreadyInDB = await client.database.verify.count(id) >= 1
          if(alreadyInDB === true){
            member.roles.cache.forEach(role => {
              if(role.name !== "@everyone"){
               list.push(role.name)
              }
            })
            return res.json({status: "ok", code: "200",servername: test.name ,roles: list })
          }else{
            return res.json({"error": true,"errormessage": "Found user, but user is not verified!"})
          }
        })
    });
}

