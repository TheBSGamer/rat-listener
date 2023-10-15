const {EmbedBuilder} = require('discord.js');
require('dotenv').config();

function modMoveEmbed(client,oldState,newState,oldChannelId,newChannelId,initiatedUserMove,logChannelMembersOnMove,messageToEdit,discordEpoch){
    let errorCheck = null;
    if ((!newState?.channelId || !oldState?.channelId) && !newChannelId){
        if (!oldState?.channelId && !newState?.channelId){
            errorCheck = `Something went wrong when generating this embed. The channel ID on both the join and leave state was null.`;
            console.log(oldState);
            console.log(newState);
        }
        else if (!oldState?.channelId){
            errorCheck = `Something went wrong when generating this embed. The channel ID on the leave state was null.`;
            console.log(oldState);
        }
        else if (!newState?.channelId){
            errorCheck = `Something went wrong when generating this embed. The channel ID on the join state was null.`;
            console.log(newState);
        }
    }
    let moveEmbed = new EmbedBuilder()
        .setColor('#F2FF8B')
        .setDescription(`<@${initiatedUserMove}> moved <@${newState.member.user.id}> from <#${oldChannelId}> to <#${newChannelId}>\nID: ${newState.member.user.id}`);

    if (newState.member.user.globalName != null){
        if (newState.member.nickname){
            moveEmbed.setAuthor({name: `${newState.member.nickname} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
        }
        else {
            if (newState.member.user.globalName === newState.member.user.username){
                moveEmbed.setAuthor({name: `${newState.member.user.globalName}`, iconURL: `${newState.member.user.displayAvatarURL()}`});
            }
            else {
                moveEmbed.setAuthor({name: `${newState.member.user.globalName} (${newState.member.user.username})`, iconURL: `${newState.member.user.displayAvatarURL()}`});
            }
        }
    }
    else {
        if (newState.member.nickname){
            moveEmbed.setAuthor({name: `${newState.member.nickname} (${newState.member.user.username}#${newState.member.user.discriminator})`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        }
        else {
            moveEmbed.setAuthor({name: `${newState.member.user.username}#${newState.member.user.discriminator}`, iconURL: `${newState.member.user.displayAvatarURL()}`})
        }
    }

    if (newState.channel?.members && logChannelMembersOnMove){
        let idArray = [];
        for (let [memberId,guildMember] of newState.channel.members){
            idArray.push(memberId);
        }
        if (newState.channel.members.size > 1){
            moveEmbed.setDescription(`<@${initiatedUserMove}> moved <@${newState.member.user.id}> from <#${oldChannelId}> to <#${newChannelId}>\nID: ${newState.member.user.id}\n\nThe following users were members of the call:`);
        }
        for (let [memberId,guildMember] of newState.channel.members){
            if (memberId === newState.member.user.id){
                continue
            }
            if (guildMember.user.globalName){
                moveEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.username})\nID: ${guildMember.user.id}`;
            }
            // legacy user
            else {
                if (guildMember.user.nickname){
                    moveEmbed.data.description += `\n<@${guildMember.user.id}> (${guildMember.user.nickname})\nID: ${guildMember.user.id}`;
                }
                else {
                    moveEmbed.data.description += `\n<@${guildMember.user.id}>\nID: ${guildMember.user.id}`;
                }
            }
        }
    }
    moveEmbed.data.description += `\n\nTime of event: ${discordEpoch} at ${discordEpoch.replace('D>',`T>`)}`;
    messageToEdit.edit({content: errorCheck, embeds: [moveEmbed]});
    console.log(`${initiatedUserMove} moved ${newState.member?.user.username} from ${oldState.channel?.name} to ${newState.channel?.name}`);
}

module.exports = modMoveEmbed;