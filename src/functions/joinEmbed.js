const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function joinEmbed(client,newState,logChannelMembersOnJoin){
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

    if (newState.channel.members && logChannelMembersOnJoin){
        if (newState.channel.members?.size > 1){
            joinEmbed.setDescription(`<@${newState.member.user.id}> joined <#${newState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
        }
        for (let [memberId,guildMember] of newState.channel.members){
            if (guildMember.user.id !== newState.member.user.id){
                if (guildMember.user.globalName){
                    joinEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.username})\nID: ${guildMember.user.id}`;
                }
                // legacy user
                else {
                    if (guildMember.user.nickname){
                        joinEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.nickname})\nID: ${guildMember.user.id}`;
                    }
                    else {
                        joinEmbed.data.description += `\n<@${guildMember.user.id}>\nID: ${guildMember.user.id}`;
                    }
                }
            }
        }
    }
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    channel.send({embeds: [joinEmbed]});
    console.log(`${newState.member.user.username} joined ${newState.channel.name}`);
}

module.exports = joinEmbed;