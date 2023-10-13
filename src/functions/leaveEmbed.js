const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function leaveEmbed(client,oldState,newState){
    let leaveEmbed = new EmbedBuilder()
        .setColor('#ff9696')
        .setTimestamp()
        .setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}`);
    
    if (newState.member.user.globalName != null){
        leaveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
    }
    else {
        leaveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
    }

    if (oldState.channel.members){
        if (oldState.channel.members.size > 0){
            leaveEmbed.setDescription(`<@${newState.member.user.id}> left <#${oldState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
        }
        for (let [memberId,guildMember] of oldState.channel.members){
            if (guildMember.user.globalName){
                leaveEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.username})\nID: ${guildMember.user.id}`;
            }
            // legacy user
            else {
                if (guildMember.user.nickname){
                    leaveEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.nickname})\nID: ${guildMember.user.id}`;
                }
                else {
                    leaveEmbed.data.description += `\n<@${guildMember.user.id}>\nID: ${guildMember.user.id}`;
                }
            }
        }
    }
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    channel.send({embeds: [leaveEmbed]});
    console.log(`${newState.member.user.username} left ${oldState.channel.name}`);
}

module.exports = leaveEmbed;