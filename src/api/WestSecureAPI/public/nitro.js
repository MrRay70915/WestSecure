module.exports = (client, app) => {
  return app.get("/api/booster/:user", (req, res) => {
    const id = req.params.user;
    if (!id) return res.json({"error": true,"errormessage": "userId not supplied"})
    let guild = 912112387988004874;
    if (id == 212081114095943690|| id == 570320433157505033){
      return res.json({"hasBoosted": true})
    };
    let server = client.guilds.cache.get("912112387988004874")
    if (server){
      server.members.fetch(id).then(m => {
        if(m.premiumSince === null) return  res.json({"hasBoosted": false})
        if(m.premiumSince) return res.json({"hasBoosted": true})
      });
    };

  return  res.json({"hasBoosted": false})


  });

}