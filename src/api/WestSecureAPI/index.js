module.exports = (client) => {
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser')
    const port = 555
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json());

    
    app.get("/", function(req, res) {
      res.send("sorry but no")
    });
    
    const { promisify } = require("util");
    const readdir = promisify(require("fs").readdir); 
    async function service(){
        const public = await readdir('./src/api/WestSecureAPI/public/');
        public.forEach(apiModule => {
            require(`./public/${apiModule}`)(client, app)
            client.logger.api(`WestSecure API Module: ${apiModule} Loaded into memory`)
        })
        app.listen(port, () => {
            client.logger.api(`WestSecure API online, http://localhost:${port}`);
        })
    }
    service();
}