module.exports = (client) => {
    const https = require("https")
    const http = require("http")
    client.apis.https = {}
    client.apis.https.get = (url) => {
        const data = new Promise((resolve, reject) => {
            https.get(url, (res) =>{
                res.on('data', async (raw) => { // do function when get data
                    try {
                        const output = JSON.parse(raw);
                        resolve(output)
                    } catch (error) {
                        reject(error)
                    }
                })
            }).on('error', (e) => {
                reject(e)
            });
        })
        return data.then(output => {
            return output;
        })
    }
    client.apis.https.post = (data, options) => {
        const Promisedata = new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)
              
                res.on('data', d => {
                    const output = JSON.parse(d);
                    resolve(output)
                })
              })
              
              req.on('error', error => {
                resolve(error)
              })
              
              req.write(data)
              req.end()
        })
        return Promisedata.then(output => {
            return output;
        })
    }
}
