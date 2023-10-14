const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function leaveEmbed(client,oldState,newState,logChannelMembersOnLeave,messageToEdit,discordEpoch){
    let errorCheck = null;
    if (!oldState?.channelId){
        errorCheck = `Something went wrong when generating this embed. The channel ID on the leave state was null.`;
        console.log(oldState);
    }
    let leaveEmbed = new EmbedBuilder()
        .setColor('#ff9696')
        .setDescription(`<@${oldState.member.user.id}> left <#${oldState?.channelId}>\nID: ${oldState.member.user.id}`);
    
    if (newState.member.user.globalName != null){
        leaveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
    }
    else {
        leaveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
    }

    if (oldState.channel?.members && logChannelMembersOnLeave){
        if (oldState.channel.members.size > 0){
            leaveEmbed.setDescription(`<@${newState.member.user.id}> left <#${oldState?.channelId}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
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
    leaveEmbed.data.description += `\n\nTime of event: ${discordEpoch} at ${discordEpoch.replace('D>',`T>`)}`;
    messageToEdit.edit({content: errorCheck, embeds: [leaveEmbed]});
    console.log(`${newState.member?.user.username} left ${oldState.channel?.name}`);
}

module.exports = leaveEmbed;