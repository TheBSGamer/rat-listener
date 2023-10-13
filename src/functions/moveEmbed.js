const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function moveEmbed(client,oldState,newState,logChannelMembersOnMove){
    let moveEmbed = new EmbedBuilder()
        .setColor('#4CC0FF')
        .setTimestamp()
        .setDescription(`<@${newState.member.user.id}> moved from <#${oldState.channel.id}> to <#${newState.channel.id}>\nID: ${newState.member.user.id}`);

    if (newState.member.user.globalName != null){
        moveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
    }
    else {
        moveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
    }

    if (newState.channel.members && logChannelMembersOnMove){
        let idArray = [];
        for (let [memberId,guildMember] of newState.channel.members){
            idArray.push(memberId);
        }
        if (newState.channel.members.size > 1){
            moveEmbed.setDescription(`<@${newState.member.user.id}> moved from <#${oldState.channel.id}> to <#${newState.channel.id}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
        }
        for (let [memberId,guildMember] of newState.channel.members){
            if (memberId === newState.member.user.id){
                continue
            }
            if (guildMember.user.globalName){
                moveEmbed.addFields({
                    name: `${guildMember.user.globalName} (${guildMember.user.username})`,
                    value: `ID: ${guildMember.user.id}`,
                    inline: false
                });
            }
            else {
                moveEmbed.addFields({
                    name: `${guildMember.user.username}#${guildMember.user.discriminator}`,
                    value: `ID: ${guildMember.user.id}`,
                    inline: false
                });
            }
        }
    }
    let channel = client.channels.cache.get(process.env.LOGS_CHANNEL);
    channel.send({embeds: [moveEmbed]});
    console.log(`${newState.member.user.username} moved from ${oldState.channel.name} to ${newState.channel.name}`);
}

module.exports = moveEmbed;