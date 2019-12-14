
const Discord = require('discord.js');
const Scoreboard = require('../class/Managers/ScoreboardManager')
const Giveaway = require('../class/Fun/Giveway')
module.exports = async (client) => {
    const SM = new Scoreboard()
    const giveaway = new Giveaway()
    giveaway.launch(client)
    SM.refresh(client)
    client.user.setPresence({
        game: {
            name: "https://holycloud.fr/"
        }
    })
    client.user.setUsername("HolyBot")
}