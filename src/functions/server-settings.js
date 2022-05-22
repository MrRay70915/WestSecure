module.exports = (client) => {
    client.enmap = {}
    client.enmap.edit = function(message, value, key){
        return client.WestSecure.edit(message.guild.id, key, value).then(value => {return value})
    }
    client.enmap.add = function(message, value, key){
        return client.WestSecure.add(message.guild.id, key, value).then(value => {return value})
    }
    client.enmap.remove = function(message, value, key){
        return client.WestSecure.remove(message.guild.id, key, value).then(value => {return value})
    }
}