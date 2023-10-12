const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function joinEmbed(client,newState){
    let joinEmbed = new EmbedBuilder()
        .setColor('#9dff96')
        .setTimestamp()
        .setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>\nID: ${newState.member.user.id}`);
    
    if (newState.member.user.globalName != null){
        joinEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
    }
    else {
        joinEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
    }

    if (newState.channel.members){
        if (newState.channel.members?.size > 1){
            joinEmbed.setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
        }
        for (let [memberId,guildMember] of newState.channel.members){
            if (guildMember.user.id !== newState.member.user.id){
                if (guildMember.user.globalName){
                    joinEmbed.addFields({
                        name: `${guildMember.user.globalName} (${guildMember.user.username})`,
                        value: `ID: ${guildMember.user.id}`,
                        inline: false
                    });
                }
                else {
                    joinEmbed.addFields({
                        name: `${guildMember.user.username}#${guildMember.user.discriminator}`,
                        value: `ID: ${guildMember.user.id}`,
                        inline: false
                    });
                }
            }
        }
    }
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    channel.send({embeds: [joinEmbed]});
    console.log(`${newState.member.user.username} joined ${newState.channel.name}`);
}

module.exports = joinEmbed;