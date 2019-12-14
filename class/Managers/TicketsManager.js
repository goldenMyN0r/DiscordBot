const config = require('../../config/support.json')
const Discord = require("discord.js")
class TicketsManager{

    create(message, reason){
        message.guild.createChannel(`ticket-${message.author.id}`, {
            type: 'text',
            permissionOverwrites: [{
                id: message.guild.id,
                deny: ['READ_MESSAGES']
            }]
        }).then(c => {
            c.setParent(config.category)
            let e = new Discord.RichEmbed()
                .setColor("#0yrsz")
                .setTitle("Ticket")
                .setDescription("Ticket crée par " + message.author.username + "." + " \n la raison de ce ticket est " + reason + ".")
                .setFooter("HolyCloud", message.author.displayAvatarURL)
                .setTimestamp();
            c.send(e);
            c.setTopic(`Créateur du ticket : ${message.author.username}\n Raison : ${reason} \n \n /close : ferme le ticket \n /add : ajoute quelq'un au ticket \n /remove : retire quelq'un du ticket`);
            var support = message.guild.roles.find(r => r.id === config.role)
            c.overwritePermissions(support, {SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, READ_MESSAGES: true});
            c.overwritePermissions(message.author, {SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, READ_MESSAGES: true, EMBED_LINKS:true, ATTACH_FILES:true})
        })
    }
    verify(message){
        var chan = message.guild.channels.find(c => c.name == `ticket-${message.author.id}`)
        if(chan) {
            message.delete()
            message.channel.send(":x: Impossible de récréer un ticket.Beuillez fermer l'autre")
            return false;
        }
        return true;
    }
    async close(message){
        const base = await message.channel.send(":warning: Êtes vous sur de vouloir supprimer votre ticket ? Vous ne pourrez plus retrouver les message. \n :white_check_mark: Oui \n <:x:597060657279402004> non")
        await base.react("✅")
        await base.react("❌")

        const collector = base.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on('collect', async(reaction) => {
            if (reaction.emoji.name === "✅") {
                message.channel.delete()
                message.author.send(":white_check_mark: Votre ticket à bien été supprimé !")
            }

            if (reaction.emoji.name === "❌") {
                base.delete().catch()
                message.channel.send(":x: Action annulée. ")
            }
        });
    }
    add(message){
        let channel = message.mentions.channels.first()
        let membre = message.guild.member(message.mentions.users.first())
        if(!channel) return message.channel.send(":x: Vous devez mentionner un salon !")
        if(!channel.name.startsWith("ticket-")) return message.channel.send(":x: Ce salon n'est pas un ticket !")
        if(!membre) return message.channel.send(":x: Vous devez mentionner quelqu'un à ajouter au ticket !")
        channel.overwritePermissions(membre, {SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, READ_MESSAGES: true})
        message.delete()
        message.channel.send(`${membre} a bien été ajouté au ticket ${channel} par ${message.author.username}.`)
    }
    remove(message){
        let membre = message.guild.member(message.mentions.users.first())
	if(!message.channel.name.startsWith("ticket-")) return message.channel.send(":x: Ce salon n'est pas un ticket !")
	if(!membre) return message.channel.send(":x: Vous devez mentionner quelqu'un à retirer ticket !")
	if(membre.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas vous retirer de votre propre ticket !")
	message.channel.overwritePermissions(membre, {SEND_MESSAGES: false, READ_MESSAGE_HISTORY: false, READ_MESSAGES: false})
	message.delete()
	message.channel.send(`${membre} a bien été retiré du ticket ${message.channel} par ${message.author.username}.`)
    }
}
module.exports = TicketsManager;