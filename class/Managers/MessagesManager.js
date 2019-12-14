const Discord = require('discord.js');
const config = require('../../config/main.json');
const permissions = require('../Helpers/permission');
const prefix = '/';
class MessagesManager{

    constructor(bot, message){
        this.bot     = bot
        this.message = message
    }
    manager(){
        let message = this.message
        if(message.author.bot || message.channel.type === 'dm' || message.channel.permissionsFor(this.bot.user).has('SEND_MESSAGES') === false  || message.content.startsWith(prefix) == false){return }
        let args = message.content.slice(prefix.length).trim().split(/ +/g)
        let commande = args.shift()
        let verify = this.verify(commande)
        let cmd = this.bot.commands.get(commande);
        if(verify == false) return
        if(cmd) cmd.run(this.bot, message, args)
    }
    verify(commande){
        let message = this.message
        let user = message.guild.members.get(message.author.id)
        if(permissions(user, message, "ADMINISTOR")) return true;
        if(commande === 'new' && message.channel.id !== config.channels.tickets){
            message.delete()
            message.channel.send(`:x: Merci d'utiliser cette commande dans <#${config.channels.tickets}> !`)
            return false
        }
        
        if(commande !== 'new' && message.channel.id !== config.channels.commands){
            message.delete()
            message.channel.send(`:x: Merci d'utiliser cette commande dans <#${config.channels.commands}> !`)
            return false
        }
        if(commande === 'close' && message.channel.name.startsWith("ticket-") === false){
            message.delete()
            message.channel.send(`:x: Merci d'utiliser cette commande selement pour un ticket !`)
            return false
        }
        return true;
    }

}
module.exports = MessagesManager;