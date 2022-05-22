module.exports = (client, app) => {
    return app.get("/ping", (req, res) => {
      res.send("PONG!")
      
    });
}

