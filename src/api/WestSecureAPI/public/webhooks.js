const SecretKey = process.env.SECRETKEY
module.exports = (client, app) => {
    app.post("/webhook/:teamname", async (req, res) =>{
        let body = req.body
        let teamname = req.params.teamname
        teamname = teamname.toLowerCase()
        let channelName = `${teamname}-logs`
        let channel = client.channels.cache.find(c => c.name === channelName)
        let msgcontent = body.content
       
        if (body.key) {
          if (body.key == SecretKey.toString()) {
            try {
              let thread = channel.threads.cache.find(x => x.name === body.thread);
              if (!msgcontent || msgcontent == "") {
                thread.send({embeds: [body.embeds]})
              }else{
                thread.send({content:msgcontent, embeds: [body.embeds]})
              }
              
            
            return res.json({status: "success", code: "200"})
            }catch(er){
              return res.json({status: "error", code: "400", errormsg: er.message})
            }          
          }
        }
        return res.json({status: "error", code: "400", errormsg: "Invalid Key provided"})
    })  
}