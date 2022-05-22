module.exports = (client, app) => {
    return app.get("/api/booster/:user", (req, res) => {
    const id = req.params.user
    let guild = 912112387988004874;
    if (!guild) return res.json({"error": true,"errormessage": "guild not supplied"}) // if a guild is not supplied, this returns false
    if (!id) return res.json({"error": true,"errormessage": "userId not supplied"})// if a user is not supplied, this returns false
    if (id == 212081114095943690|| id == 570320433157505033) {
      return res.json({"hasBoosted": true})
    }
    let server = client.guilds.cache.get("912112387988004874")

    if (server){
      server.members.fetch(id).then(m => {
        if(m.premiumSince === null) return  res.json({"hasBoosted": false})// user has not boosted server
        if(m.premiumSince) return res.json({"hasBoosted": true}) // user has boosted server
      });
    }
      
return  res.json({"hasBoosted": false})
  
})

