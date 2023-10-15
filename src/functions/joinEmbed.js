const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function joinEmbed(client,newState,newChannelId,logChannelMembersOnJoin,messageToEdit,discordEpoch){
    let errorCheck = null;
    if (!newState?.channelId && !newChannelId){
        errorCheck = `Something went wrong when generating this embed. The channel ID on the join state was null.`;
        console.log(newState);
    }
    let joinEmbed = new EmbedBuilder()
        .setColor('#9dff96')
        .setDescription(`<@${newState.member.user.id}> joined <#${newChannelId}>\nID: ${newState.member.user.id}`);
    
    if (newState.member.user.globalName != null){
        if (newState.member.nickname){
            joinEmbed.setAuthor({name: `${newState.member.nickname} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
        }
        else {
            if (newState.member.user.globalName === newState.member.user.username){
                joinEmbed.setAuthor({name: `${newState.member.user.globalName}`, iconURL: `${newState.member.user.displayAvatarURL()}`});
            }
            else {
                joinEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
            }
        }
    }
    else {
        if (newState.member.nickname){
            joinEmbed.setAuthor({name: `${newState.member.nickname} (${newState.member.user.username}#${newState.member.user.discriminator})`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        }
        else {
            joinEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        }
    }

    if (newState.channel?.members && logChannelMembersOnJoin){
        if (newState.channel?.members?.size > 1){
            joinEmbed.setDescription(`<@${newState.member.user.id}> joined <#${newChannelId}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
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
    joinEmbed.data.description += `\n\nTime of event: ${discordEpoch} at ${discordEpoch.replace('D>',`T>`)}`;
    messageToEdit.edit({content: errorCheck, embeds: [joinEmbed]});
    console.log(`${newState.member?.user.username} joined ${newState.channel?.name || newChannelId}`);
}

module.exports = joinEmbed;