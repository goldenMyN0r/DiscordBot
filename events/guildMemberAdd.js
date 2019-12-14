const Discord = require("discord.js")
const config = require('../config/events.json')
module.exports = (client, member) => {
    let main = client.channels.find(channel => channel.name.includes("discussion"))

    member.addRole(config.join.role)
    let embled = new Discord.RichEmbed()
        .setColor("#32CD32")
        .setTitle("Nouvelle arrivée sur le discord")
        .setDescription("Bienvenue **"+  member.displayName +  "** \n  \n */Aide** > **help* \n **Support** > */new*\n **Site** > *https://holycloud.fr*")
        .setFooter("HolyCloud", member.displayAvatarURL)
        .setTimestamp();
        main.send(embled);
}